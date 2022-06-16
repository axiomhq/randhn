import { serve } from "https://deno.land/std@0.119.0/http/server.ts";
import { Status } from "https://deno.land/std@0.143.0/http/http_status.ts";
import { Client } from "https://deno.land/x/axiom@v0.1.0alpha6/client.ts";

import { handleHTML } from "./stumble.tsx";

const topHNStoriesURL =
  "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty";
const newHNStoriesURL =
  "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty";
const HNItemURL =
  "https://hacker-news.firebaseio.com/v0/item/{id}.json?print=pretty";

const axiom = new Client();

const fetchStories = async function (url: string): Promise<number[]> {
  try {
    const resp = await fetch(url);
    return await resp.json();
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const handler = async function (req: Request): Promise<Response> {
  const now = Date.now();

  const path = new URL(req.url).pathname;

  const topReq = fetchStories(topHNStoriesURL);
  const newReq = fetchStories(newHNStoriesURL);
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
    minStoryID: dedupedStories[0],
    maxStoryID: dedupedStories[dedupedStories.length - 1],
    distinctStoriesLength: dedupedStories.length,
    story: story,
  };

  axiom
    .ingest({
      events: [handlerAttr],
      dataset: "randhn",
    })
    .catch((e) => {
      console.error(e);
    });

  switch (path) {
    case "/":
      return Response.redirect(story["url"], 302);
    case "/json":
      return new Response(JSON.stringify(story, null, 2), {
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    case "/html":
      return handleHTML(story);

    default:
      // return 404
      return new Response(null, {
        status: Status.NotFound,
      });
  }
};

serve(handler);
