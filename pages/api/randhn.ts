import Client from '@axiomhq/axiom-node';
import {
    HNItem,
    InvalidHNItem,
    fetchHNItem,
    fetchHNStories
} from './hn';

const url = process.env.NEXT_AXIOM_URL || 'https://api.axiom.co';
const apiKey = process.env.NEXT_AXIOM_API_KEY;
const orgId = process.env.NEXT_AXIOM_ORG_ID;
const axiom = new Client(url, apiKey, orgId);

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
    frame: boolean
): Promise<Selection[]> {
    const fetches: Promise<number[]>[] = [];

    switch (topic) {
        case "top":
        case null:
            fetches.push(fetchHNStories("topstories"));
            break;
        case "new":
            fetches.push(fetchHNStories("newstories"));
            break;
        case "show":
            fetches.push(fetchHNStories("showstories"));
            break;
        case "ask":
            fetches.push(fetchHNStories("askstories"));
            break;
        case "best":
            fetches.push(fetchHNStories("beststories"));
            break;
        case "random":
            fetches.push(
                fetchHNStories("topstories"),
                fetchHNStories("topstories"),
                fetchHNStories("topstories"),
                fetchHNStories("topstories")
            );
            break;
        default:
            throw new Error("Invalid topic");
    }

    const ids = await Promise.all(fetches);
    const allIDs = ids.flat(); // Use .flat() to flatten the array instead of reduce

    // Deduplicate the array using Set
    const dedupedStories = [...new Set(allIDs)];

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

    // parallel fetch the stories and check frame, filter out nulls
    const stories = await Promise.all(
        randIDs.map(async (id) => {
            const item = await fetchHNItem(id);
            if (frame) {
                // checkFrame(item);
                if (await checkFrame(item)) {
                    return item;
                }
                // filter this out
                return InvalidHNItem;
            }
            return item;
        }),
    ).then((items) => {
        return items.filter((item) => item !== InvalidHNItem);
    }) as HNItem[];


    const selections: Selection[] = stories.map(
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
  ['hn']
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
  ['hn']
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


export async function randhn(kind: string): Promise<object> {
    const now = Date.now();
    const frame = true;
    const limit = 3;
    const stories = await getRandomHNStories(kind, limit, frame);
    const selection = stories[Math.floor(Math.random() * stories.length)];

    console.log("time to get stories:", Date.now() - now);

    let stats = {};

    if (selection) {
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

    let result = {
        story: selection.story,
        stats: stats,
    }

    // jsonify result
    return result;
}

