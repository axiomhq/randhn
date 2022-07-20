const topHNStoriesURL =
    "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty";
const newHNStoriesURL =
    "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty";
const showHNStoriesURL =
    "https://hacker-news.firebaseio.com/v0/showstories.json?print=pretty";
const askHNStoriesURL =
    "https://hacker-news.firebaseio.com/v0/askstories.json?print=pretty";
const bestHNStoriesURL =
    "https://hacker-news.firebaseio.com/v0/beststories.json?print=pretty";
const HNItemURL =
    "https://hacker-news.firebaseio.com/v0/item/{id}.json?print=pretty";


export interface HNItem {
    by: string;
    descendants: number;
    id: number;
    kids: number[];
    score: number;
    time: number;
    title: string;
    type: string;
    url: string;

    text?: string;
    parent?: number;
    dead?: boolean;
    deleted?: boolean;
}

// implements the HNItem interface
export const InvalidHNItem = {
    by: "",
    descendants: 0,
    id: -1,
    kids: [],
    score: 0,
    time: 0,
    title: "",
    type: "",
    url: "",
}

export async function fetchEmpty(): Promise<number[]> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return [];
}


export async function fetchTopHNStories(): Promise<number[]> {
    return fetchFromHN(topHNStoriesURL);
}

export async function fetchNewHNStories(): Promise<number[]> {
    return fetchFromHN(newHNStoriesURL);
}

export async function fetchShowHNStories(): Promise<number[]> {
    return fetchFromHN(showHNStoriesURL);
}

export async function fetchAskHNStories(): Promise<number[]> {
    return fetchFromHN(askHNStoriesURL);
}

export async function fetchBestHNStories(): Promise<number[]> {
    return fetchFromHN(bestHNStoriesURL);
}

async function fetchFromHN(url: string): Promise<number[]> {
    try {
        const resp = await fetch(url);
        return await resp.json();
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function fetchHNItem(id: number): Promise<HNItem> {
    const story = await fetch(HNItemURL.replace("{id}", id.toString()));
    const item = await story.json();
    return item;
}