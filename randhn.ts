import { serve } from "https://deno.land/std@0.119.0/http/server.ts";
import { Status } from "https://deno.land/std@0.143.0/http/http_status.ts";

const topHNStoriesURL =
  "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty";
const newHNStoriesURL =
  "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty";
const HNItemURL =
  "https://hacker-news.firebaseio.com/v0/item/{id}.json?print=pretty";

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
  const topReq = fetchStories(topHNStoriesURL);
  const newReq = fetchStories(newHNStoriesURL);
  const [topStories, newStories] = await Promise.all([topReq, newReq]);
  // union the two arrays
  const stories = [...topStories, ...newStories];
  // dedup the array
  const dedupedStories = stories.filter((item, index) =>
    stories.indexOf(item) === index
  );
  // pick random story
  const randomStory =
    dedupedStories[Math.floor(Math.random() * dedupedStories.length)];
  // fetch the story
  const storyReq = await fetch(
    HNItemURL.replace("{id}", randomStory.toString()),
  );
  const story = await storyReq.json();
  // return the story

  switch (new URL(req.url).pathname) {
    case "/":
      return Response.redirect(story["url"], 302);
    case "/json":
      return Response.json(story);
    default:
      // return 404
      return new Response(null, {
        status: Status.NotFound,
      });
  }
};

serve(handler);
