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
      className={`${className} fixed top-0 right-0 z-10 w-72 font-mono text-xs space-y-4 overflow-y-auto `}
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
          <div className="flex items-center justify-between">
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
            <span className="text-xs text-orange-900 opacity-70">
              [{ago} ago]
            </span>
          </div>
          <div className="flex items-center justify-start space-x-3">
            <span
              className="flex items-center text-orange-900 text-opacity-90 py-1 text-xxs"
              title="karma"
            >
              <svg
                width="1rem"
                height="1rem"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.9326 14.2162L16.8155 13.4754C16.5763 13.5132 16.3701 13.6641 16.2618 13.8807C16.1535 14.0972 16.1564 14.3528 16.2696 14.5668L16.9326 14.2162ZM16.9326 8.78383L16.2696 8.4332C16.1564 8.64725 16.1535 8.90279 16.2618 9.11935C16.3701 9.33591 16.5763 9.48685 16.8155 9.52464L16.9326 8.78383ZM12 6.35276L11.3185 6.66599C11.4409 6.93218 11.707 7.10276 12 7.10276C12.293 7.10276 12.5591 6.93218 12.6815 6.66599L12 6.35276ZM7.06744 8.78382L7.18449 9.52464C7.42366 9.48685 7.62988 9.33591 7.73821 9.11935C7.84653 8.90278 7.84364 8.64725 7.73044 8.43319L7.06744 8.78382ZM7.06745 14.2162L7.73044 14.5668C7.84364 14.3528 7.84654 14.0972 7.73821 13.8807C7.62988 13.6641 7.42367 13.5132 7.18449 13.4754L7.06745 14.2162ZM12 16.6472L12.6815 16.334C12.5591 16.0678 12.293 15.8972 12 15.8972C11.707 15.8972 11.4409 16.0678 11.3185 16.334L12 16.6472ZM16.2696 14.5668C16.4165 14.8446 16.5 15.1614 16.5 15.5H18C18 14.9112 17.854 14.3542 17.5955 13.8655L16.2696 14.5668ZM18.5 11.5C18.5 12.4968 17.77 13.3246 16.8155 13.4754L17.0496 14.957C18.7217 14.6928 20 13.2464 20 11.5H18.5ZM16.8155 9.52464C17.77 9.67544 18.5 10.5032 18.5 11.5H20C20 9.7536 18.7217 8.30719 17.0496 8.04302L16.8155 9.52464ZM16.5 7.5C16.5 7.83855 16.4165 8.15539 16.2696 8.4332L17.5955 9.13446C17.854 8.6458 18 8.08884 18 7.5H16.5ZM14.5 5.5C15.6046 5.5 16.5 6.39543 16.5 7.5H18C18 5.567 16.433 4 14.5 4V5.5ZM12.6815 6.66599C12.9985 5.97635 13.6944 5.5 14.5 5.5V4C13.087 4 11.8712 4.83727 11.3185 6.03952L12.6815 6.66599ZM9.5 5.5C10.3056 5.5 11.0015 5.97635 11.3185 6.66599L12.6815 6.03952C12.1288 4.83727 10.913 4 9.5 4V5.5ZM7.5 7.5C7.5 6.39543 8.39543 5.5 9.5 5.5V4C7.567 4 6 5.567 6 7.5H7.5ZM7.73044 8.43319C7.58351 8.15539 7.5 7.83855 7.5 7.5H6C6 8.08884 6.14602 8.6458 6.40445 9.13446L7.73044 8.43319ZM5.5 11.5C5.5 10.5032 6.23 9.67544 7.18449 9.52464L6.9504 8.04301C5.27833 8.30719 4 9.75361 4 11.5H5.5ZM7.18449 13.4754C6.23 13.3246 5.5 12.4968 5.5 11.5H4C4 13.2464 5.27833 14.6928 6.9504 14.957L7.18449 13.4754ZM7.5 15.5C7.5 15.1614 7.58351 14.8446 7.73044 14.5668L6.40446 13.8655C6.14602 14.3542 6 14.9112 6 15.5H7.5ZM9.5 17.5C8.39543 17.5 7.5 16.6046 7.5 15.5H6C6 17.433 7.567 19 9.5 19V17.5ZM11.3185 16.334C11.0015 17.0236 10.3056 17.5 9.5 17.5V19C10.913 19 12.1288 18.1627 12.6815 16.9605L11.3185 16.334ZM14.5 17.5C13.6944 17.5 12.9985 17.0236 12.6815 16.334L11.3185 16.9605C11.8712 18.1627 13.087 19 14.5 19V17.5ZM16.5 15.5C16.5 16.6046 15.6046 17.5 14.5 17.5V19C16.433 19 18 17.433 18 15.5H16.5Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M13.5 11.75C13.5 12.5784 12.8284 13.25 12 13.25V14.75C13.6569 14.75 15 13.4069 15 11.75H13.5ZM12 13.25C11.1716 13.25 10.5 12.5784 10.5 11.75H9C9 13.4069 10.3431 14.75 12 14.75V13.25ZM10.5 11.75C10.5 10.9216 11.1716 10.25 12 10.25V8.75C10.3431 8.75 9 10.0931 9 11.75H10.5ZM12 10.25C12.8284 10.25 13.5 10.9216 13.5 11.75H15C15 10.0931 13.6569 8.75 12 8.75V10.25Z"
                  fill="currentColor"
                ></path>
              </svg>
              {user?.karma}
            </span>
            <span
              className="flex items-center text-orange-900 text-opacity-90 text-xxs"
              title="joined"
            >
              <svg width="1rem" height="1rem" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4.75 8.75C4.75 7.64543 5.64543 6.75 6.75 6.75H17.25C18.3546 6.75 19.25 7.64543 19.25 8.75V17.25C19.25 18.3546 18.3546 19.25 17.25 19.25H6.75C5.64543 19.25 4.75 18.3546 4.75 17.25V8.75Z"
                ></path>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M8 4.75V8.25"
                ></path>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M16 4.75V8.25"
                ></path>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M7.75 10.75H16.25"
                ></path>
              </svg>

              {timeSince(user?.created ?? 0)}
            </span>
          </div>
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
                  className={`text-orange-900 breakWords max-h-32 overflow-y-auto scroll-y-none`}
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
      <footer className="fixed right-0 bottom-0 w-72 h-12 z-10 bg-owhite border-t-2 border-orange-800 border-opacity-20 p-3">
        {""}
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
              className="block border-2 border-orange-700 border-opacity-10 hover:border-opacity-20 rounded transition-colors bg-owhite hover:bgWhite p-2"
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
