import { User } from '@/hooks/use-user';
import { NextRequest } from 'next/server';

export const GET = async (_: NextRequest, { params: { id } }: { params: { id: string } }) => {
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/user/${id}.json`, {
    method: 'GET',
    headers: {
      'Accept-Encoding': 'application/json',
    },
  });
  const json = await response.json();
  const user = json as User;
  return new Response(JSON.stringify(user), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
