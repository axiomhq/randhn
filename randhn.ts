import { serve } from "https://deno.land/std@0.119.0/http/server.ts";

const topHNStories = "https://hacker-news.firebaseio.com/v0/topstories";
const newHNStories = "https://hacker-news.firebaseio.com/v0/newstories";

serve((req: Request) => new Response("Hello World"));
