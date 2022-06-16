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
