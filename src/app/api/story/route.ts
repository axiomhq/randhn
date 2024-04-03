import { axiom } from '@/axiom';
import '@total-typescript/ts-reset';

const topHNStoriesURL = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty';
const newHNStoriesURL = 'https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty';
const showHNStoriesURL = 'https://hacker-news.firebaseio.com/v0/showstories.json?print=pretty';
const askHNStoriesURL = 'https://hacker-news.firebaseio.com/v0/askstories.json?print=pretty';
const bestHNStoriesURL = 'https://hacker-news.firebaseio.com/v0/beststories.json?print=pretty';

const getHackerNewsStoryIds = async (type: string) => {
  const url = (() => {
    switch (type) {
      case 'top':
        return topHNStoriesURL;
      case 'new':
        return newHNStoriesURL;
      case 'show':
        return showHNStoriesURL;
      case 'ask':
        return askHNStoriesURL;
      case 'best':
        return bestHNStoriesURL;
      default:
        return topHNStoriesURL;
    }
  })();

  const result = await fetch(url);
  const json = await result.json();
  return json as number[];
};

const HNItemURL = 'https://hacker-news.firebaseio.com/v0/item/{id}.json?print=pretty';

export type Story = {
  id: string;
  title: string;
  url: string;
  score: number;
  by: string;
  descendants: number;
  time: number;
  kids: string[];
  type: string;
};

export type StoryRef = {
  _time: string;
  data: {
    title: string;
    url: string;
    ref: string;
  };
};

export type Stats = {
  userStats: {
    show: StoryRef[];
    ask: StoryRef[];
    job: StoryRef[];
    story: StoryRef[];
  };
  interactions: StoryRef[];
  domainSiblings: StoryRef[];
};

const checkIfSupportsIFrame = async (story: Story): Promise<boolean> => {
  try {
    // Check if the story has a URL
    if (!story.url) {
      return false;
    }

    const headRes = await fetch(story.url, { method: 'HEAD' });
    if (headRes.status !== 200) {
      return false;
    }

    // Check if the site has can be embedded in an iframe
    for (const [key, value] of Array.from(headRes.headers)) {
      if (
        (key.toLowerCase() === 'x-frame-options' && value.toLowerCase().indexOf('sameorigin') >= 0) ||
        value.toLowerCase().indexOf('deny') >= 0
      ) {
        return false;
      } else if (key.toLowerCase() === 'content-security-policy' && value.toLowerCase().indexOf('frame-ancestors') >= 0) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const getTopCommenters = async (storyId: string) => {
  try {
    const result = await axiom.aplQuery(
      `
        ['hn']
        | where _time >= now(-90d)
        | where type == "comment" and root == ${storyId}
        | summarize count() by ['by']
      `,
    );

    return result.buckets.totals?.map((u) => u.group.by as string) ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getTopStoriesForUsers = async (userIds: string[]) => {
  try {
    const users = userIds.map((u) => `"${u}"`).join(',');
    const result = await axiom.aplQuery(
      `
      ['hn']
      | where _time >= now(-365d)
      | where type == "story" and ['by'] in (${users})
      | where title != ""
      | summarize count() by title, url
      | limit 5
    `,
    );

    return (
      result.buckets.totals?.map((s) => ({
        title: s.group.title as string,
        url: s.group.url as string,
      })) ?? []
    );
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getSimiliarInteraction = async (id: string) => {
  // Get a list of top commenters on the story
  const topCommenters = await getTopCommenters(id);

  // Check if there are any top commenters
  if (topCommenters.length === 0) return [];

  // Get the top 5 stories commented by those users
  const stories = await getTopStoriesForUsers(topCommenters);

  // Check if there are any stories
  if (stories.length === 0) return [];

  // Return the stories
  return stories;
};

type StatsEvent = {
  _time: string;
  data: {
    ref: string;
    title?: string;
    url?: string;
    xType: 'show' | 'ask' | 'job' | 'story';
  };
};

const getUserStats = async (
  userId: string,
  storyId: string,
): Promise<{
  show: StatsEvent[];
  ask: StatsEvent[];
  job: StatsEvent[];
  story: StatsEvent[];
}> => {
  const rows = (await axiom
    .aplQuery(
      `
    ['hn']
    | where _time >= now(-90d)
    | where ['by'] == "${userId}" and ['id'] != ${storyId}
    // FIXME: remove later
    | where type == "story" and title !startswith_cs "Show HN:"
    | extend xType = case (type == "story" and title startswith_cs "Show HN:", "show", type == "story" and title startswith_cs "Ask HN:", "ask", type)
    | project title, xType, url
    | take 100
  `,
    )
    .then((res) => res.matches ?? [])) as StatsEvent[];

  // Check if there are any stats
  if (rows.length === 0) {
    return {
      show: [],
      ask: [],
      job: [],
      story: [],
    };
  }

  const stats = {
    show: [] as StatsEvent[],
    ask: [] as StatsEvent[],
    job: [] as StatsEvent[],
    story: [] as StatsEvent[],
  };

  // Group the stats by type
  for (const row of rows) {
    const xType = row.data.xType as keyof typeof stats;
    if (stats[xType].length < 5) {
      stats[xType].push(row);
    }
  }

  return stats;
};

const getSiblings = async (story: Story): Promise<StoryRef[]> => {
  const domain = new URL(story.url).hostname;
  const rows = await axiom
    .aplQuery(
      `
    ['hn']
    | where _time >= now(-90d)
    | where type == "story" and url startswith "https://${domain}" and id != ${story.id}
    | project title, url, _time
    | order by _time desc
    | take 30
  `,
    )
    .then((res) => res.matches ?? []);

  const siblings = new Map();

  for (const row of rows) {
    // Skip if the story doesn't have a URL
    if (!row.data.url) continue;

    // Skip if the story is already in the list
    if (siblings.has(row.data.url)) continue;

    // Add the story to the list
    siblings.set(row.data.url, {
      _time: row._time,
      data: {
        title: row.data.title,
        url: row.data.url,
        xType: 'story',
        ref: '',
      },
    });
  }

  return Array.from(siblings.values());
};

type DomainSiblings = {
  _time: string;
  data: {
    title: string;
    url: string;
    ref: string;
  };
}[];

const getDomainStories = async (story: Story): Promise<DomainSiblings> => {
  // Skip if the story doesn't have a URL
  if (!story.url) return [];

  // Get stories with the same domain
  const siblings = await getSiblings(story);

  // Get the top 5 stories
  return siblings.slice(0, 5);
};

export const GET = async (request: Request) => {
  const type = new URL(request.url).searchParams.get('type') || 'top';
  const storyIds = await getHackerNewsStoryIds(type);

  // Fetch 10 random stories
  const stories = await Promise.all(
    storyIds
      .toSorted(() => Math.random() - 0.5)
      .slice(0, 10)
      .map(async (id) => {
        const result = await fetch(HNItemURL.replace('{id}', id.toString()));
        const json = await result.json();
        return json as Story;
      }),
  );

  // Filter out stories that don't support iframes
  const storiesWithIFrameSupport = await Promise.all(
    stories.map(async (story) => {
      const supportsIFrame = await checkIfSupportsIFrame(story);
      if (!supportsIFrame) return null;
      return story;
    }),
  ).then((stories) => stories.filter(Boolean));

  // Select a random story from the list
  const story = storiesWithIFrameSupport[Math.floor(Math.random() * storiesWithIFrameSupport.length)];

  const userStatsReq = getUserStats(story.by, story.id);
  const domainSiblingsReq = getDomainStories(story);
  const interactionsReq = getSimiliarInteraction(story.id);

  const [userStats, domainSiblings, interactions] = await Promise.all([userStatsReq, domainSiblingsReq, interactionsReq]);

  const stats = {
    userStats: userStats,
    domainSiblings: domainSiblings,
    interactions: interactions,
  };

  // Return the stories as JSON
  return new Response(
    JSON.stringify({
      story,
      stats,
    }),
    {
      headers: {
        'content-type': 'application/json',
      },
    },
  );
};
