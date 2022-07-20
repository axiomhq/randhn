// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { APIResult, ExtendedAPIResult, User } from '../../store/types';
import { randhn } from "./randhn";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExtendedAPIResult>
) {
  const kind = (req.query.kind as string) ?? "random";

  let result: ExtendedAPIResult | undefined;

  for (let i = 0; i < 10; i++) {
    result = await getStory(kind);
    if (result) break;
  }

  if (result) {
    result.user = await getUser(result.story.by);

    res.status(200).json(result);
  } else {
    res.status(500);
  }
}

async function getStory(kind: string): Promise<APIResult | undefined> {
  try {
    const res = await randhn(kind);
    return res as APIResult;
  } catch (e) {
    console.error(e);
  }
}

async function getUser(id: string): Promise<User | undefined> {
  try {
    const res = await fetch(
      `https://hacker-news.firebaseio.com/v0/user/${id}.json`,
      {
        method: "GET",
        headers: {
          "Accept-Encoding": "application/json",
        },
      }
    );
    return (await res.json()) as User;
  } catch (e) {
    return undefined;
  }
}
