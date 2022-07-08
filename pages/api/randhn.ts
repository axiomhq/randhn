// deno-lint-ignore-file no-explicit-any
import type { NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import Client from '@axiomhq/axiom-node';
import hn from 'node-hn-api';


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

const axiom = new Client();

interface HNItem {
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

interface Selection {
    minStoryID: number;
    maxStoryID: number;
    distinctStoriesLength: number;
    story: HNItem;
}

interface AxiomEvent {
    _time: string;
    data: {
        ref: string;
        title?: string;
        url?: string;
        xType: "show" | "ask" | "job" | "story";
    };
}

async function getRandomHNStories(
    topic: string | null,
    limit: number,
    frame: boolean,
): Promise<Selection[]> {
    const fetches: Promise<number[]>[] = [];
    switch (topic) {
        case "top" || null:
            fetches.push(hn.fetchTopStories(500));
            break;
        case "new":
            fetches.push(hn.fetchNewStories(500));
            break;
        case "show":
            fetches.push(hn.fetchShowStories(500));
            break;
        case "ask":
            fetches.push(hn.fetchAskStories(500));
            break;
        case "best":
            fetches.push(hn.fetchBestStories(500));
            break;
        case "random":
            fetches.push(
                hn.fetchTopStories(500),
                hn.fetchNewStories(500),
                hn.fetchShowStories(500),
                hn.fetchAskStories(500),
                hn.fetchBestStories(500),
            );
            break;
        default:
            throw new Error("Invalid topic");
    }


    const ids = await Promise.all(fetches);
    const allIDs = ids.reduce((acc, curr) => { return acc.concat(curr); }, []);

    // dedup the array
    const dedupedStories = allIDs.filter(
        (item, index) => allIDs.indexOf(item) === index,
    );

    return await selectRandomHNStories(dedupedStories, limit, frame);
}

async function selectRandomHNStories(
    ids: number[],
    limit: number,
    frame: boolean,
): Promise<Selection[]> {
    // get min/max id
    const minStoryID = Math.min(...ids);
    const maxStoryID = Math.max(...ids);

    const randIDs = new Array(limit).fill(0).map(() => {
        const index = Math.floor(Math.random() * ids.length);
        return ids[index];
    });

    // parallel fetch the stories and check frame
    const stories = await Promise.all(
        randIDs.map(async (id) => {
            const story = await fetch(HNItemURL.replace("{id}", id.toString()));
            const item = await story.json();
            if (frame) {
                // checkFrame(item);
                if (await checkFrame(item)) {
                    return item;
                }
                return null;
            }
            return item;
        }),
    );

    const selections: Selection[] = stories.filter((item) => item !== null).map(
        (story) => {
            return {
                minStoryID,
                maxStoryID,
                distinctStoriesLength: ids.length,
                story,
            };
        },
    );

    if (selections.length === 0) {
        return selectRandomHNStories(ids, limit, frame);
    }

    return selections;
}
type DomainSiblings = AxiomEvent[];

async function getDomainStories(story: HNItem): Promise<DomainSiblings> {
    console.log("finding domain siblings for:", story.url);

    if (story.url === undefined) {
        return [];
    }

    const domain = new URL(story.url).hostname;
    const domainQueryStr = `
  ['hackernews']
  | where _time >= now(-90d)
  | where type == "story" and url startswith "https://${domain}" and id != ${story.id}
  | project title, url, _time
  | order by _time desc
  | take 30
  `;

    const res = await axiom.datasets.aplQuery(domainQueryStr);

    const siblings: DomainSiblings = [];
    const deduper = new Set<string>();
    if (res.matches) {
        res.matches.forEach((s: any) => {
            const row = s as AxiomEvent;
            if (row.data.url) {
                if (deduper.has(row.data.url)) {
                    return;
                }
                deduper.add(row.data.url);
                siblings.push({
                    _time: row._time,
                    data: {
                        title: row.data.title,
                        url: row.data.url,
                        xType: "story",
                        ref: "",
                    },
                });
            }
        });
    }

    // if siblings > 5 then return 5
    if (siblings.length > 5) {
        return siblings.slice(0, 5);
    }
    return siblings;
}

interface UserActivity {
    show: AxiomEvent[];
    ask: AxiomEvent[];
    job: AxiomEvent[];
    story: AxiomEvent[];
}

async function getUserStats(story: HNItem): Promise<UserActivity> {
    const userQueryStr = `
  ['hackernews']
  | where _time >= now(-90d)
  | where ['by'] == "${story.by}" and ['id'] != ${story.id}
  // FIXME: remove later
  | where type == "story" and title !startswith_cs "Show HN:"
  | extend xType = case (type == "story" and title startswith_cs "Show HN:", "show", type == "story" and title startswith_cs "Ask HN:", "ask", type)
  | project title, xType, url
  | take 100
  `;

    const res = await axiom.datasets.aplQuery(userQueryStr);

    const dict: UserActivity = {
        show: [],
        ask: [],
        job: [],
        story: [],
    };

    if (res.matches) {
        res.matches.forEach((s: any) => {
            const row = s as AxiomEvent;
            // cast to string
            const xType = row.data.xType;

            // check if xType is in dict
            if (dict[xType] && dict[xType].length < 5) {
                dict[xType].push(row);
            }
        });
    }

    return dict;
}

async function checkFrame(story: HNItem): Promise<boolean> {
    try {
        if (story.url === undefined) {
            return false;
        }
        const headRes = await fetch(story.url, { method: "HEAD" });
        if (headRes.status !== 200) {
            return false;
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

        return !crap;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export default async function handler(
    req: NextApiRequest,
    resp: NextApiResponse,
) {
    const path = req.query.path as string;
    // extract kind from params
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { query } = useRouter();

    const kind = query.kind as string ?? "random";
    const hasStats = query.stats as string ?? "true";
    const canFrame = query.canFrame as string ?? "false";

    const now = Date.now();
    // get stories
    const frame = canFrame === "true";
    let limit = 1;
    if (frame === true) {
        limit = 3;
    }
    const stories = await getRandomHNStories(kind, limit, frame);
    const selection = stories[Math.floor(Math.random() * stories.length)];


    console.log("time to get stories:", Date.now() - now);

    let stats = {};

    if (hasStats == "true" && selection) {
        const userStatsReq = getUserStats(selection.story);
        const domainSiblingsReq = getDomainStories(selection.story);

        const [userStats, domainSiblings] = await Promise.all([
            userStatsReq,
            domainSiblingsReq,
        ]);

        stats = {
            userStats: userStats,
            domainSiblings: domainSiblings,
        };
    }

    // dedup domainSiblings based on url

    switch (path) {
        case "/":
            return resp.redirect(302, selection.story.url);
        case "/json":
            return resp.status(200).json(
                {
                    story: selection.story,
                    stats: stats,
                },
            );
        default:
            return resp.status(404)
    }
}

