export type StoryKind = "random" | "top" | "best" | "ask" | "show";

export type LoadStoryFunc = (kind: StoryKind) => void;

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
  domainSiblings: StoryRef[];
};

export type APIResult = {
  story: Story;
  stats: Stats;
};

export type ExtendedAPIResult = APIResult & {
  user?: User;
};

export type User = {
  id: string;
  about: string;
  created: number;
  karma: number;
};
