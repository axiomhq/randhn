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
const bestHNStoriesURL =
  "https://hacker-news.firebaseio.com/v0/beststories.json?print=pretty";
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

async function fetchEmpty(): Promise<number[]> {
  await new Promise((resolve) => setTimeout(resolve, 0));
  return [];
}

async function fetchFromHN(url: string): Promise<number[]> {
  try {
    const resp = await fetch(url);
    return await resp.json();
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function notifyAxiom(
  now: number,
  req: Request,
  sel: Selection,
): Promise<void> {
  const url = new URL(req.url);
  const path = url.pathname;
  const kind = url.searchParams.get("kind") ?? "random";
  const hasStats = url.searchParams.get("stats") ?? "true";
  const canFrame = url.searchParams.get("canFrame") ?? "false";

  const handlerAttr = {
    _time: new Date(now).toISOString(),
    req: {
      method: req.method,
      referrer: req.referrer,
      url: req.url,
      params: {
        kind: kind,
        stats: hasStats === "true",
        canFrame: canFrame === "true",
      },
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
}

async function getRandomHNStories(
  topic: string | null,
  limit: number,
  frame: boolean,
): Promise<Selection[]> {
  const fetches = [];
  switch (topic) {
    case "random":
      fetches.push(
        fetchFromHN(topHNStoriesURL),
        fetchFromHN(newHNStoriesURL),
        fetchFromHN(showHNStoriesURL),
        fetchFromHN(askHNStoriesURL),
        fetchFromHN(bestHNStoriesURL),
      );
      break;
    case "top" || null:
      fetches.push(
        fetchFromHN(topHNStoriesURL),
        fetchEmpty(),
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
        fetchEmpty(),
      );
      break;
    case "show":
      fetches.push(
        fetchFromHN(showHNStoriesURL),
        fetchEmpty(),
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
        fetchEmpty(),
      );
      break;
    case "best":
      fetches.push(
        fetchFromHN(bestHNStoriesURL),
        fetchEmpty(),
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
  const storyIDs = [
    ...topStories,
    ...newStories,
    ...showStories,
    ...askStories,
  ];
  // dedup the array
  const dedupedStories = storyIDs.filter(
    (item, index) => storyIDs.indexOf(item) === index,
  );

  return await selectRandomHNStories(dedupedStories, limit, frame);
}

async function selectRandomHNStories(
  ids: number[],
  limit: number,
  frame: boolean,
): Promise<Selection[]> {
  // get min/max id
  const minStoryID = Math.min(...ids);
  const maxStoryID = Math.max(...ids);

  const randIDs = new Array(limit).fill(0).map(() => {
    const index = Math.floor(Math.random() * ids.length);
    return ids[index];
  });

  // parallel fetch the stories and check frame
  const stories = await Promise.all(
    randIDs.map(async (id) => {
      const story = await fetch(HNItemURL.replace("{id}", id.toString()));
      const item = await story.json();
      if (frame) {
        // checkFrame(item);
        if (await checkFrame(item)) {
          return item;
        }
        return null;
      }
      return item;
    }),
  );

  const selections: Selection[] = stories.filter((item) => item !== null).map(
    (story) => {
      return {
        minStoryID,
        maxStoryID,
        distinctStoriesLength: ids.length,
        story,
      };
    },
  );

  if (selections.length === 0) {
    return selectRandomHNStories(ids, limit, frame);
  }

  return selections;
}
type DomainSiblings = AxiomEvent[];

async function getDomainStories(story: HNItem): Promise<DomainSiblings> {
  console.log("finding domain siblings for:", story.url);

  if (story.url === undefined) {
    return [];
  }

  const domain = new URL(story.url).hostname;
  const domainQueryStr = `
  ['hackernews']
  | where _time >= now(-90d)
  | where type == "story" and url startswith "https://${domain}" and id != ${story.id}
  | project title, url, _time
  | order by _time desc
  | take 30
  `;

  const res = await axiom.query({
    apl: domainQueryStr,
  });

  const siblings: DomainSiblings = [];
  const deduper = new Set<string>();
  for (const event of res.matches) {
    const ev = event as AxiomEvent;
    const urlStr = ev.data.url ?? "";
    if (deduper.has(urlStr) == false) {
      siblings.push(event as AxiomEvent);
      deduper.add(urlStr);
    }
  }

  // if siblings > 5 then return 5
  if (siblings.length > 5) {
    return siblings.slice(0, 5);
  }
  return siblings;
}

interface UserActivity {
  show: AxiomEvent[];
  ask: AxiomEvent[];
  job: AxiomEvent[];
  story: AxiomEvent[];
}

async function getUserStats(story: HNItem): Promise<UserActivity> {
  const userQueryStr = `
  ['hackernews']
  | where _time >= now(-90d)
  | where ['by'] == "${story.by}" and ['id'] != ${story.id}
  // FIXME: remove later
  | where type == "story" and title !startswith_cs "Show HN:"
  | extend xType = case (type == "story" and title startswith_cs "Show HN:", "show", type == "story" and title startswith_cs "Ask HN:", "ask", type)
  | project title, xType, url
  | take 100
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
}

async function checkFrame(story: HNItem): Promise<boolean> {
  try {
    if (story.url === undefined) {
      return false;
    }
    const headRes = await fetch(story.url, { method: "HEAD" });
    if (headRes.status !== 200) {
      return false;
    }

    let crap = false;

    headRes.headers.forEach((value, key) => {
      key = key.toLowerCase();
      value = value.toLowerCase();

      if (key === "x-frame-options") {
        if (value.indexOf("sameorigin") >= 0 || value.indexOf("deny") >= 0) {
          crap = true;
        }
      } else if (key === "content-security-policy") {
        if (value.indexOf("frame-ancestors") >= 0) {
          crap = true;
        }
      }
    });

    return !crap;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const kind = url.searchParams.get("kind") ?? "random";
  const hasStats = url.searchParams.get("stats") ?? "true";
  const canFrame = url.searchParams.get("canFrame") ?? "false";
  const now = Date.now();
  // get stories
  const frame = canFrame === "true";
  let limit = 1;
  if (frame === true) {
    limit = 3;
  }
  const stories = await getRandomHNStories(kind, limit, frame);
  const selection = stories[Math.floor(Math.random() * stories.length)];

  const notifyReq = notifyAxiom(now, req, selection);

  console.log("time to get stories:", Date.now() - now);

  let stats = {};

  if (hasStats == "true" && selection) {
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
  await notifyReq;

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
}

serve(handler);
