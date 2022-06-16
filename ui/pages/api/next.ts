// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Story } from '../../store/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Story>
) {
  let story: Story | undefined;

  while (!story) {
    story = await getStory("random");
  }

  if (story) {
    res.status(200).json(story);
  } else {
    res.status(500);
  }
}

async function getStory(kind: string): Promise<Story | undefined> {
  const result = await fetch(`https://randhn.deno.dev/json?kind=${kind}`, {
    method: "GET",
    headers: {
      "Accept-Encoding": "application/json",
    },
  });
  const story: Story = await result.json();

  const res = await fetch(story.url, { method: "HEAD" });
  if (res.status !== 200) {
    return undefined;
  }

  let crap = false;

  console.log("\n\n", story.url);
  res.headers.forEach((value, key) => {
    key = key.toLowerCase();
    value = value.toLowerCase();

    console.log(key, value);

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

  return crap ? undefined : story;
}
