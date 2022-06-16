import React from 'react';

import { Stats, Story, StoryRef } from '../store/types';

interface SidebarProps {
  story?: Story;
  stats?: Stats;
  className?: string;
}

export const Sidebar = ({ className, stats, story }: SidebarProps) => {
  const host = story ? new URL(story.url).host : "unknown";
  let ago = "";

  if (story?.time) {
    const t = new Date(1970, 0, 1);
    t.setSeconds(story.time - t.getTimezoneOffset() * 60);
    console.log("date", t);

    ago = timeSince(t.getTime() / 1000);
  }
  return (
    <aside
      className={`${className} font-mono p-4 space-y-4`}
      style={{
        width: 300,
        height: "calc(100vh - 32px)",
        marginTop: 32,
        border: "none",
      }}
    >
      {story?.by ? (
        <div className="flex flex-col mb-4 space-y-1">
          <label className="uppercase text-xs font-bold text-orange-800 opacity-60">
            Submission
          </label>
          <span className="flex items-center justify-between">
            <a
              className={`text-black hover:text-orange-500 hover:underline flex items-center`}
              href={`https://news.ycombinator.com/user?id=${story?.by}`}
              target="_blank"
              rel="noopener"
            >
              <span>{story?.by} </span>
              <span className="mt-1 ml-1 opacity-50">
                <svg width="1em" height="1em" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M9.25 4.75H6.75C5.64543 4.75 4.75 5.64543 4.75 6.75V17.25C4.75 18.3546 5.64543 19.25 6.75 19.25H17.25C18.3546 19.25 19.25 18.3546 19.25 17.25V14.75"
                  ></path>
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M19.25 9.25V4.75H14.75"
                  ></path>
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M19 5L11.75 12.25"
                  ></path>
                </svg>
              </span>
            </a>
            <span className="text-xs text-grey-700 opacity-40">
              [{ago} ago]
            </span>
          </span>
        </div>
      ) : null}
      <div className="flex flex-col space-y-4">
        <SidebarSection
          title="Recent Submissions"
          refs={stats?.userStats.story}
        />
        <SidebarSection title="Show HNs" refs={stats?.userStats.show} />
        <SidebarSection title="Ask HNs" refs={stats?.userStats.ask} />
        <SidebarSection
          title={`More from ${host} `}
          refs={stats?.userStats.show}
        />
      </div>
    </aside>
  );
};

interface SidebarSectionProps {
  title: string;
  refs?: StoryRef[];
}

const SidebarSection = ({ title, refs }: SidebarSectionProps) => {
  if (!refs || refs.length === 0) {
    return null;
  }

  return (
    <div>
      <label className="mb-4 uppercase text-xs font-bold text-orange-800 opacity-60">
        {title}
      </label>
      <ul className="text-xs flex flex-col space-y-2 text-black">
        {refs.map((ref) => (
          <li key={ref.data.ref} className="hover:text-orange-500">
            <a href={ref.data.url}>
              <span className="text-gray-600">&gt;</span> {ref.data.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

function timeSince(seconds: number): string {
  let now = Date.now() / 1000;
  console.log(seconds, now, seconds < now);
  seconds = now - seconds;
  console.log(seconds);

  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + "y";
  }
  interval = seconds / 2592000;
  console.log(seconds);
  if (interval > 1) {
    return Math.floor(interval) + "mo";
  }
  interval = seconds / 86400;
  console.log(seconds);
  if (interval > 1) {
    return Math.floor(interval) + "d";
  }
  interval = seconds / 3600;
  console.log(seconds);
  if (interval > 1) {
    return Math.floor(interval) + "h";
  }
  interval = seconds / 60;
  console.log(seconds);
  return Math.floor(interval) + " m";
}
