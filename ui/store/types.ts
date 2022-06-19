export type StoryKind = "random" | "top" | "new" | "best" | "show";

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

export interface NavItem {
  id: StoryKind;
  label: string;
}

export const NavItems: NavItem[] = [
  { id: "random", label: "Random" },
  { id: "top", label: "Top" },
  { id: "new", label: "New" },
  { id: "best", label: "Best" },
  { id: "show", label: "ShowHN" },
];
