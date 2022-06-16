import React from 'react';

import { Stats, Story, StoryRef } from '../store/types';

interface SidebarProps {
  story?: Story;
  stats?: Stats;
  className?: string;
}

export const Sidebar = ({ className, stats, story }: SidebarProps) => {
  const host = story ? new URL(story.url).host : "unknown";
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
            Submitted By
          </label>
          <a href={`https://news.ycombinator.com/user?id=${story?.by}`}>
            {story?.by}
          </a>
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
