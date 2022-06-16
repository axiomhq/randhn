// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.119.0/http/server.ts";
import { Status } from "https://deno.land/std@0.143.0/http/http_status.ts";
import { Client } from "https://deno.land/x/axiom@v0.1.0alpha6/client.ts";

const topHNStoriesURL =
  "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty";
const newHNStoriesURL =
  "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty";
const showHNStoriesURL =
  "https://hacker-news.firebaseio.com/v0/showstories.json?print=pretty";
const askHNStoriesURL =
  "https://hacker-news.firebaseio.com/v0/askstories.json?print=pretty";
const HNItemURL =
  "https://hacker-news.firebaseio.com/v0/item/{id}.json?print=pretty";

const axiom = new Client();

interface HNItem {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;

  text?: string;
  parent?: number;
  dead?: boolean;
  deleted?: boolean;
}

interface Selection {
  minStoryID: number;
  maxStoryID: number;
  distinctStoriesLength: number;
  story: HNItem;
}

interface AxiomEvent {
  _time: string;
  data: {
    ref: string;
    title?: string;
    url?: string;
    xType: "show" | "ask" | "job" | "story";
  };
}

const fetchEmpty = async function (): Promise<number[]> {
  await new Promise((resolve) => setTimeout(resolve, 0));
  return [];
};

const fetchFromHN = async function (url: string): Promise<number[]> {
  try {
    const resp = await fetch(url);
    return await resp.json();
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const notifyAxiom = async function (
  now: number,
  req: Request,
  sel: Selection,
): Promise<void> {
  const path = new URL(req.url).pathname;
  const handlerAttr = {
    _time: new Date(now).toISOString(),
    req: {
      method: req.method,
      referrer: req.referrer,
      url: req.url,
      headers: {
        contentType: req.headers.get("content-type") ?? undefined,
        userAgent: req.headers.get("user-agent") ?? "Unknown",
      },
    },
    path: path,
    attrDuration: Date.now() - now,
    ...sel,
  };

  await axiom
    .ingest({
      events: [handlerAttr],
      dataset: "randhn",
    })
    .catch((e) => {
      console.error(e);
    });
};

const getRandomHNStory = async function (
  topic?: string | null,
): Promise<Selection> {
  const fetches = [];

  switch (topic) {
    case null || "random":
      fetches.push(
        fetchFromHN(topHNStoriesURL),
        fetchFromHN(newHNStoriesURL),
        fetchFromHN(showHNStoriesURL),
        fetchFromHN(askHNStoriesURL),
      );
      break;
    case "top":
      fetches.push(
        fetchFromHN(topHNStoriesURL),
        fetchEmpty(),
        fetchEmpty(),
        fetchEmpty(),
      );
      break;
    case "new":
      fetches.push(
        fetchFromHN(newHNStoriesURL),
        fetchEmpty(),
        fetchEmpty(),
        fetchEmpty(),
      );
      break;
    case "show":
      fetches.push(
        fetchFromHN(showHNStoriesURL),
        fetchEmpty(),
        fetchEmpty(),
        fetchEmpty(),
      );
      break;
    case "ask":
      fetches.push(
        fetchFromHN(askHNStoriesURL),
        fetchEmpty(),
        fetchEmpty(),
        fetchEmpty(),
      );
      break;
    default:
      throw new Error("Invalid topic");
  }

  const [topStories, newStories, showStories, askStories] = await Promise.all(
    fetches,
  );

  // union the two arrays
  const stories = [...topStories, ...newStories, ...showStories, ...askStories];
  // dedup the array
  const dedupedStories = stories.filter(
    (item, index) => stories.indexOf(item) === index,
  );

  // pick random story
  const randID =
    dedupedStories[Math.floor(Math.random() * dedupedStories.length)];
  // fetch the story
  const storyReq = await fetch(HNItemURL.replace("{id}", randID.toString()));
  const story = await storyReq.json();
  // return the story
  return {
    minStoryID: dedupedStories[0],
    maxStoryID: dedupedStories[dedupedStories.length - 1],
    distinctStoriesLength: dedupedStories.length,
    story,
  };
};

type DomainSiblings = AxiomEvent[];

const getDomainStories = async function (
  story: HNItem,
): Promise<DomainSiblings> {
  console.log("finding domain siblings for:", story.url);

  if (story.url === undefined) {
    return [];
  }

  const domain = new URL(story.url).hostname;
  const domainQueryStr = `
  ['hackernews']
  | where _time >= now(-90d)
  | where type == "story" and url startswith "https://${domain}" and id != ${story.id}
  | extend xType = "story"
  | project title, url, ref, xType
  | take 100
  `;

  const res = await axiom.query({
    apl: domainQueryStr,
  });

  const siblings: DomainSiblings = [];
  const deduper = new Set<string>();
  for (const event of res.matches) {
    const ev = event as AxiomEvent;
    if (!deduper.has(ev.data.url ?? "")) {
      siblings.push(event as AxiomEvent);
      deduper.add(ev.data.url ?? "");
    }
  }

  return siblings;
};

interface UserActivity {
  show: AxiomEvent[];
  ask: AxiomEvent[];
  job: AxiomEvent[];
  story: AxiomEvent[];
}

const getUserStats = async function (story: HNItem): Promise<UserActivity> {
  const userQueryStr = `
  ['hackernews']
  | where _time >= now(-90d)
  | where ['by'] == "${story.by}" and ['id'] != ${story.id}
  | extend xType = case (type == "story" and title startswith_cs "Show HN:", "show", type == "story" and title startswith_cs "Ask HN:", "ask", type)
  | project title, xType, ref, url
  | take 10000
  `;

  const res = await axiom.query({
    apl: userQueryStr,
  });

  const dict: UserActivity = {
    show: [],
    ask: [],
    job: [],
    story: [],
  };

  res.matches.forEach((s: any) => {
    const row = s as AxiomEvent;
    // cast to string
    const xType = row.data.xType;

    // check if xType is in dict
    if (dict[xType] && dict[xType].length < 5) {
      dict[xType].push(row);
    }
  });

  return dict;
};

const handler = async function (req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const kind = url.searchParams.get("kind");
  const hasStats = url.searchParams.get("stats") ?? "true";
  const now = Date.now();
  const selection = await getRandomHNStory(kind);

  let stats = {};

  if (hasStats == "true") {
    const userStatsReq = getUserStats(selection.story);
    const domainSiblingsReq = getDomainStories(selection.story);

    const [userStats, domainSiblings] = await Promise.all([
      userStatsReq,
      domainSiblingsReq,
    ]);

    stats = {
      userStats: userStats,
      domainSiblings: domainSiblings,
    };
  }

  // dedup domainSiblings based on url

  await notifyAxiom(now, req, selection);

  switch (path) {
    case "/":
      return Response.redirect(selection.story.url, 302);
    case "/json":
      return new Response(
        JSON.stringify(
          {
            story: selection.story,
            stats: stats,
          },
          null,
          2,
        ),
        {
          headers: {
            "content-type": "application/json; charset=utf-8",
          },
        },
      );

    default:
      // return 404
      return new Response(null, {
        status: Status.NotFound,
      });
  }
};

serve(handler);
