const HN_API_BASE_URL = 'https://hacker-news.firebaseio.com/v0';
const HNItemURL = `${HN_API_BASE_URL}/item/{id}.json?print=pretty`;

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

export const InvalidHNItem: HNItem = {
    by: '',
    descendants: 0,
    id: -1,
    kids: [],
    score: 0,
    time: 0,
    title: '',
    type: '',
    url: '',
};

export async function fetchEmpty(): Promise<number[]> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return [];
}

export async function fetchHNStories(endpoint: string): Promise<number[]> {
    try {
        const url = `${HN_API_BASE_URL}/${endpoint}.json?print=pretty`;
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export async function fetchHNItem(id: number): Promise<HNItem> {
    try {
        const url = HNItemURL.replace('{id}', id.toString());
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}
