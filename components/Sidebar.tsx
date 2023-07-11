import React, { ReactElement } from "react";

import { Stats, Story, StoryRef, User } from "../store/types";
import { timeSince, urlify } from "../util";
import { AxiomIcon, CalendarIcon, GitHubIcon, LinkIcon, LotusIcon } from "./Icons";

interface SidebarProps {
  story?: Story;
  stats?: Stats;
  user?: User;
  className?: string;
  loading: boolean;
}

export const Sidebar = ({ className, stats, story, user }: SidebarProps) => {
  const hostURL = new URL(story?.url || "https://rand.hn");
  const host = hostURL.hostname.replace(/^www\./, "");

  hostURL.pathname = "/";

  let title = story?.title ?? "";
  let tag: string | undefined;
  if (title.startsWith("Show HN:")) {
    tag = "Show HN";
    title = title.replace(/^Show HN:/, "").trim();
  }

  let ago = "";

  if (story?.time) {
    const t = new Date(1970, 0, 1);
    t.setSeconds(story.time + -1 * t.getTimezoneOffset() * 60);
    ago = timeSince(t.getTime() / 1000);
  }
  return (
    <aside
      className={`${className} font-mono text-xs space-y-4 overflow-y-auto`}
      style={{
        height: "calc(100vh - 32px)",
        marginTop: 32,
      }}
    >
      <div className="mt-3 mx-3">
        <div className="text-lg leading-tight text-orange-900">
          {tag ? (
            <span className="leading-loose uppercase border-2 border-orange-700 border-opacity-20 bg-orange-500 bg-opacity-5 rounded px-1 py-0.5 font-semibold text-xs mr-2 ">
              {tag}
            </span>
          ) : null}
          {title}
        </div>
      </div>
      {story?.by ? (
        <div className="flex flex-col mb-4 space-y-1 px-3">
          <label className="uppercase text-xs font-bold text-orange-800 opacity-60">Submission By</label>
          <div className="flex items-center justify-between">
            <a
              className={`text-orange-900 text-sm hover:text-orange-500 hover:underline flex items-center`}
              href={`https://news.ycombinator.com/user?id=${story?.by}`}
              title="View user profile"
              aria-label="View user profile"
            >
              <span>{story?.by} </span>
              <span className="mt-1 ml-1 opacity-75">
                <LinkIcon />
              </span>
            </a>
            <span className="text-xs text-orange-900 opacity-70">[{ago} ago]</span>
          </div>
          {user ? (
            <div>
              <div
                className={`mt-2 border-2 border-orange-700 border-opacity-20 bg-orange-500 bg-opacity-5 rounded p-2`}
                style={{
                  filter: "drop-shadow(0 2px 1px rgba(196, 131, 110, 0.1))",
                }}
              >
                <div
                  className={`text-orange-900 breakWords max-h-32 overflow-y-auto scroll-y-none break-words ${
                    user.about?.length > 0 ? "mb-2" : "mb-0"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: urlify(user.about || ""),
                  }}
                ></div>
                <div className="flex items-center justify-between space-x-3">
                  <span
                    className="flex items-center text-orange-900 text-opacity-90 text-xxs space-x-0.5"
                    title="karma"
                  >
                    <LotusIcon />
                    {user?.karma}
                  </span>
                  <span
                    className="flex items-center text-orange-900 text-opacity-90 text-xxs space-x-0.5"
                    title="joined"
                  >
                    <CalendarIcon />
                    {timeSince(user?.created ?? 0)}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="flex-1 flex flex-col px-3 space-y-4 pb-48 lg:pb-16">
        <SidebarSection title="Recent Submissions" refs={stats?.userStats.story} />
        <SidebarSection title="Show HNs" refs={stats?.userStats.show} />
        <SidebarSection title="Ask HNs" refs={stats?.userStats.ask} />
        <SidebarSection
          title={
            <span>
              More from{" "}
              <a className="underline" href={hostURL.toString()} title={`Visit ${host}`} aria-label={`Visit ${host}`}>
                {host}
              </a>
            </span>
          }
          refs={stats?.domainSiblings}
        />
      </div>
      <footer className="fixed right-0 bottom-0 w-72 h-12 z-10 bg-owhite border-t-2 border-orange-800 border-opacity-20 p-3 hidden lg:flex items-center justify-end">
        <a
          className="flex items-center hover:underline text-orange-800"
          href="https://github.com/axiomhq/randhn"
          title="GitHub Repo"
          aria-label="RandHN Github repository"
        >
          <GitHubIcon />
        </a>
        <div className="font-bold text-orange-900 opacity-50">&nbsp;/&nbsp;</div>
        <a
          className="flex items-center hover:underline text-orange-800 "
          href="https:axiom.co"
          target="_blank"
          title="Visit Axiom"
          aria-label="Axiom Twitter account"
        >
          o11y by Axiom <AxiomIcon className="ml-2" />
        </a>
      </footer>
    </aside>
  );
};

//<svg width="131" height="118" viewBox="0 0 131 118" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>

interface SidebarSectionProps {
  title: string | ReactElement;
  refs?: StoryRef[];
}

const SidebarSection = ({ title, refs }: SidebarSectionProps) => {
  refs = (refs || [])
    .slice(0, 5)
    .sort((a, b) => b._time.localeCompare(a._time))
    .filter((a) => a.data.title?.length > 0 && a.data.url?.length > 0 && a.data.title?.length > 0);
  if (!refs || refs.length === 0) {
    return null;
  }

  return (
    <div>
      <label className="uppercase font-bold text-orange-800 opacity-60">{title}</label>
      <ul className="text-black">
        {refs.map((ref) => (
          <li key={ref.data.url} className="mt-1">
            <a
              className="block border-2 border-orange-700 border-opacity-10 hover:border-opacity-20 rounded transition-colors bg-owhite hover:bg-white p-2"
              style={{
                filter: "drop-shadow(0 2px 1px rgba(196, 131, 110, 0.1))",
              }}
              href={ref.data.url}
              title="View story"
              aria-label="View story in new tab"
            >
              {" "}
              <span className="text-orange-800">[{timeSince(Date.parse(ref._time) / 1000)}]</span> {ref.data.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
