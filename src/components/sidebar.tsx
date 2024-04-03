'use client';
import React from 'react';
import { Icon } from './icons';
import { cn } from '@/cn';
import { useStore } from '@tanstack/react-store';
import { globalStore } from '@/global-store';
import { useUser } from '@/hooks/use-user';
import { useStory } from '@/hooks/use-story';
import { useStats } from '@/hooks/use-stats';
import type { StoryRef } from '@/app/api/story/route';

type SidebarSectionProps = {
  title: React.ReactNode;
  refs?: StoryRef[];
};

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
              className="block border-2 border-orange-700 border-opacity-10 hover:border-opacity-20 rounded transition-colors bg-white hover:bg-white p-2"
              style={{
                filter: 'drop-shadow(0 2px 1px rgba(196, 131, 110, 0.1))',
              }}
              href={ref.data.url}
              title="View story"
              aria-label="View story in new tab"
            >
              {' '}
              <span className="text-orange-800">[{timeSince(Date.parse(ref._time) / 1000)}]</span> {ref.data.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const timeSince = (time: number) => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diff = Date.now() - time;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return rtf.format(-seconds, 'second');
  } else if (minutes < 60) {
    return rtf.format(-minutes, 'minute');
  } else if (hours < 24) {
    return rtf.format(-hours, 'hour');
  } else if (days < 7) {
    return rtf.format(-days, 'day');
  } else if (weeks < 4) {
    return rtf.format(-weeks, 'week');
  } else if (months < 12) {
    return rtf.format(-months, 'month');
  } else {
    return rtf.format(-years, 'year');
  }
};

const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;

const urlify = (text: string) => {
  return text.replace(urlRegex, function (url) {
    url = url.startsWith('www') ? `http://${url}` : url;

    return `<a class="underline" href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
};

type SidebarProps = {
  className?: string;
};

export const Sidebar = ({ className }: SidebarProps) => {
  const sidebarOpen = useStore(globalStore, (s) => s.sidebarOpen);
  const { data: story } = useStory();
  const { data: user } = useUser();
  const { data: stats } = useStats();
  const hostURL = new URL(story?.url || 'https://rand.hn');
  const host = hostURL.hostname.replace(/^www\./, '');
  hostURL.pathname = '/';
  const title = story?.title.startsWith('Show HN:') ? story?.title.replace(/^Show HN:/, '').trim() : story?.title;
  const tag = story?.title.startsWith('Show HN:') ? 'Show HN' : '';
  const ago = story?.time ? timeSince(story.time * 1000) : '';

  return (
    <aside
      className={cn(
        'font-mono text-xs space-y-4 overflow-y-auto h-[100dvh] pt-8 overflow-scroll',
        'fixed top-0 right-0 w-full lg:w-72 flex-0 bg-orange-50 transition-transform',
        sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0',
        className,
      )}
    >
      <div className="pt-3 px-3">
        <div className="text-lg leading-tight text-orange-900">
          {tag && (
            <span className="leading-loose uppercase border-2 border-orange-700 border-opacity-20 bg-orange-500 bg-opacity-5 rounded px-1 py-0.5 font-semibold text-xs mr-2">
              {tag}
            </span>
          )}
          {title}
        </div>
      </div>
      {story?.by && (
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
                <Icon name="link" />
              </span>
            </a>
            <span className="text-xs text-orange-900 opacity-70">[{ago}]</span>
          </div>
          {user && (
            <div>
              <div
                className="mt-2 border-2 border-orange-700 border-opacity-20 bg-orange-500 bg-opacity-5 rounded p-2"
                style={{
                  filter: 'drop-shadow(0 2px 1px rgba(196, 131, 110, 0.1))',
                }}
              >
                <div
                  className={cn(
                    'text-orange-900 breakWords max-h-32 overflow-y-auto scroll-y-none break-words',
                    user.about?.length > 0 ? 'mb-2' : 'mb-0',
                  )}
                  dangerouslySetInnerHTML={{
                    __html: urlify(user.about || ''),
                  }}
                />
                <div className="flex items-center justify-between space-x-3">
                  <span className="flex items-center text-orange-900 text-opacity-90 text-xxs space-x-0.5" title="karma">
                    <Icon name="lotus" />
                    {user?.karma}
                  </span>
                  <span
                    className="flex items-center text-orange-900 text-opacity-90 text-xxs space-x-0.5"
                    title={`joined ${timeSince(user?.created ? user?.created * 1000 : 0)}`}
                  >
                    <Icon name="calendar" />
                    {timeSince(user?.created ? user?.created * 1000 : 0)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="flex-1 flex flex-col px-3 space-y-4 pb-48 lg:pb-16">
        <SidebarSection title="Recent Submissions" refs={stats?.userStats.story} />
        <SidebarSection title="Show HNs" refs={stats?.userStats.show} />
        <SidebarSection title="Ask HNs" refs={stats?.userStats.ask} />
        <SidebarSection
          title={
            <span>
              More from{' '}
              <a className="underline" href={hostURL.toString()} title={`Visit ${host}`} aria-label={`Visit ${host}`}>
                {host}
              </a>
            </span>
          }
          refs={stats?.domainSiblings}
        />
      </div>
      <div className="relative">
        <footer className="fixed right-0 bottom-0 w-72 h-12 z-10 bg-white border-t-2 border-orange-800 border-opacity-20 p-3 hidden lg:flex items-center justify-end">
          <a
            className="flex items-center hover:underline text-orange-800"
            href="https://github.com/axiomhq/randhn"
            title="GitHub Repo"
            aria-label="RandHN Github repository"
          >
            <Icon name="github" />
          </a>
          <div className="font-bold text-orange-900 opacity-50">&nbsp;/&nbsp;</div>
          <a
            className="flex items-center hover:underline text-orange-800 "
            href="https://axiom.co"
            title="Visit Axiom"
            aria-label="Axiom Twitter account"
          >
            sponsored by Axiom <Icon name="axiom" className="ml-2" />
          </a>
        </footer>
      </div>
    </aside>
  );
};
