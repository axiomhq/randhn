// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { APIResult, Story } from '../../store/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResult>
) {
  const kind = (req.query.kind as string) ?? "random";

  let result: APIResult | undefined;

  for (let i = 0; i < 10; i++) {
    result = await getStory(kind);
    if (result) break;
  }

  if (result) {
    res.status(200).json(result);
  } else {
    res.status(500);
  }
}

async function getStory(kind: string): Promise<APIResult | undefined> {
  const res = await fetch(`https://randhn.deno.dev/json?kind=${kind}`, {
    method: "GET",
    headers: {
      "Accept-Encoding": "application/json",
    },
  });
  const apiRes: APIResult = await res.json();

  if (!apiRes.story.url) {
    return undefined;
  }

  const headRes = await fetch(apiRes.story.url, { method: "HEAD" });
  if (headRes.status !== 200) {
    return undefined;
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

  return crap ? undefined : apiRes;
}
