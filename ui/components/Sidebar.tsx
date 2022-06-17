import React from 'react';

import { Stats, Story, StoryRef, User } from '../store/types';

interface SidebarProps {
  story?: Story;
  stats?: Stats;
  user?: User;
  className?: string;
  loading: boolean;
}

export const Sidebar = ({ className, stats, story, user }: SidebarProps) => {
  const host = (story ? new URL(story.url).host : "unknown").replace(
    /^www\./,
    ""
  );
  let ago = "";

  if (story?.time) {
    const t = new Date(1970, 0, 1);
    t.setSeconds(story.time + -1 * t.getTimezoneOffset() * 60);
    ago = timeSince(t.getTime() / 1000);
  }
  return (
    <aside
      className={`${className} z-10 w-72 font-mono text-xs space-y-4 overflow-y-auto `}
      style={{
        height: "calc(100vh - 32px)",
        marginTop: 32,
      }}
    >
      {story?.by ? (
        <div className="flex flex-col mb-4 space-y-1 pt-3 px-3">
          <label className="uppercase text-xs font-bold text-orange-800 opacity-60">
            Submission By
          </label>
          <span className="flex items-center justify-between">
            <a
              className={`text-orange-900 text-sm hover:text-orange-500 hover:underline flex items-center`}
              href={`https://news.ycombinator.com/user?id=${story?.by}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{story?.by} </span>
              <span className="mt-1 ml-1 opacity-75">
                <svg width="1em" height="1em" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9.25 4.75H6.75C5.64543 4.75 4.75 5.64543 4.75 6.75V17.25C4.75 18.3546 5.64543 19.25 6.75 19.25H17.25C18.3546 19.25 19.25 18.3546 19.25 17.25V14.75"
                  ></path>
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M19.25 9.25V4.75H14.75"
                  ></path>
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M19 5L11.75 12.25"
                  ></path>
                </svg>
              </span>
            </a>
            <span className="text-xs text-orange-700 opacity-80">
              [{ago} ago]
            </span>
          </span>
          {user ? (
            <div>
              <div
                className={`mt-2 border-2 border-orange-700 border-opacity-20 rounded  ${
                  user.about ? "p-2" : "p-0"
                }`}
                style={{
                  filter: "drop-shadow(0 2px 1px rgba(196, 131, 110, 0.1))",
                }}
              >
                <div
                  className={`text-orange-900 break-words max-h-32 overflow-y-auto scroll-y-none`}
                  dangerouslySetInnerHTML={{
                    __html: urlify(user.about || ""),
                  }}
                ></div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="flex-1 flex flex-col px-3 space-y-4 ">
        <SidebarSection
          title="Recent Submissions"
          refs={stats?.userStats.story}
        />
        <SidebarSection title="Show HNs" refs={stats?.userStats.show} />
        <SidebarSection title="Ask HNs" refs={stats?.userStats.ask} />
        <SidebarSection
          title={`More from ${host} `}
          refs={stats?.domainSiblings}
        />
      </div>
      <footer className="fixed right-0 bottom-0 w-72 z-10 bg-owhite border-t-2 border-orange-800 border-opacity-20 p-3">
        Hello
      </footer>
    </aside>
  );
};

interface SidebarSectionProps {
  title: string;
  refs?: StoryRef[];
}

const SidebarSection = ({ title, refs }: SidebarSectionProps) => {
  refs = (refs || [])
    .slice(0, 5)
    .sort((a, b) => b._time.localeCompare(a._time))
    .filter((a) => a.data.url && a.data.title.length > 0);
  if (!refs || refs.length === 0) {
    return null;
  }

  return (
    <div>
      <label className="uppercase font-bold text-orange-800 opacity-60">
        {title}
      </label>
      <ul className="text-black">
        {refs.map((ref) => (
          <li key={ref.data.url} className="mt-1">
            <a
              className="block border-2 border-orange-700 border-opacity-20 rounded transition-colors bg-owhite hover:bg-white p-2"
              style={{
                /*backgroundColor: "rgba(255, 251, 247, 1.00)",*/
                filter: "drop-shadow(0 2px 1px rgba(196, 131, 110, 0.1))",
              }}
              href={ref.data.url}
            >
              {" "}
              <span className="text-orange-800">
                [{timeSince(Date.parse(ref._time) / 1000)}]
              </span>{" "}
              {ref.data.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

function timeSince(seconds: number): string {
  let now = Date.now() / 1000;
  seconds = now - seconds;

  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + "y";
  }

  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + "mo";
  }

  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + "d";
  }

  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + "h";
  }

  interval = seconds / 60;
  return Math.floor(interval) + " m";
}

const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;

function urlify(text: string) {
  return text.replace(urlRegex, function (url) {
    url = url.startsWith("www") ? `http://${url}` : url;

    return `<a class="underline" href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
}
