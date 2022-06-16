import { serve } from "https://deno.land/std@0.119.0/http/server.ts";
import { Status } from "https://deno.land/std@0.143.0/http/http_status.ts";
import { Client } from "https://deno.land/x/axiom@v0.1.0alpha6/client.ts";

const topHNStoriesURL =
  "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty";
const newHNStoriesURL =
  "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty";
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

const getRandomHNStory = async function (): Promise<Selection> {
  const topReq = fetchFromHN(topHNStoriesURL);
  const newReq = fetchFromHN(newHNStoriesURL);
  const [topStories, newStories] = await Promise.all([topReq, newReq]);

  // union the two arrays
  const stories = [...topStories, ...newStories];
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

const handler = async function (req: Request): Promise<Response> {
  const path = new URL(req.url).pathname;
  const now = Date.now();
  const selection = await getRandomHNStory();

  await notifyAxiom(now, req, selection);

  switch (path) {
    case "/":
      return Response.redirect(selection.story.url, 302);
    case "/json":
      return new Response(JSON.stringify(selection.story, null, 2), {
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });

    default:
      // return 404
      return new Response(null, {
        status: Status.NotFound,
      });
  }
};

serve(handler);
