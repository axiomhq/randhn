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
  const res = await fetch(
    `https://randhn.deno.dev/json?kind=${kind}&canFrame=true`,
    {
      method: "GET",
      headers: {
        "Accept-Encoding": "application/json",
      },
    }
  );
  return await res.json();
}
