import { NextSeo } from 'next-seo';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { Frame } from '../components/Frame';
import { MenuIcon, SpinnerIcon } from '../components/Icons';
import { NavBar } from '../components/NavBar';
import { Sidebar } from '../components/Sidebar';
import { Toolbar } from '../components/Toolbar';
import { ExtendedAPIResult, NavItems, Stats, Story, StoryKind, User } from '../store/types';
import { fetchWithTimeout } from '../util';

import type { NextPage } from "next";
interface HomeState {
  currentStory?: Story;
  currentStats?: Stats;
  currentUser?: User;
  currentKind: StoryKind;
  lastError?: string;
  loading: boolean;
  sidebarShowing: boolean;
}

class Home extends React.Component<NextPage, HomeState> {
  constructor(props: object) {
    super(props);

    this.state = {
      loading: false,
      currentKind: "top",
      sidebarShowing: false,
    };
  }

  componentDidMount = () => {
    const type = new URLSearchParams(window.location.search).get("t");
    const activeStoryType =
      [...NavItems.map((i) => i.id)].find((i) => i === type) || "top";
    this.loadStory(activeStoryType);
  };

  render() {
    const {
      currentStory,
      currentStats,
      currentUser,
      loading,
      lastError,
      currentKind,
      sidebarShowing,
    } = this.state;
    return (
      <div className="bg-white">
        <Head>
          <title>[RANDHN]</title>
          <meta name="description" content="Hacker News Roulette" />
          <meta name="viewport" content="initial-scale=1.0" />
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#27272a" />
          <meta name="msapplication-TileColor" content="#27272a" />
          <meta name="theme-color" content="#ffffff" />
          <script
            src="https://cdn.usefathom.com/script.js"
            data-site="IZJULEST"
            defer
          ></script>
        </Head>

        <NextSeo
          title="RandHN - Hacker News Roulette"
          description="Play Hacker News roulette and let RandHN serve up interesting content via the Hacker News API."
          canonical="https://rand.hn"
          openGraph={{
            url: "https://rand.hn",
            title: "RandHN - Hacker News Roulette",
            description:
              "Play Hacker News roulette and let RandHN serve up interesting content via the Hacker News API.",
            images: [
              {
                url: "https://rand.hn/og.png",
                width: 800,
                height: 600,
                alt: "RandHN - Hacker News Roulette",
                type: "image/png",
              },
            ],
            site_name: "SiteName",
          }}
          twitter={{
            handle: "@handle",
            site: "@site",
            cardType: "summary_large_image",
          }}
        />

        <NavBar loadStory={this.loadStory} loading={loading} />
        <main className={`flex`}>
          <div
            className={`fixed w-full h-full z-40 flex items-center justify-around pointer-events-none transition-all ease-out duration-500 bg-owhite bg-opacity-20  ${
              loading ? "opacity-75" : "opacity-0"
            }`}
          >
            <SpinnerIcon
              className={`${loading ? "animate-spin" : ""} text-orange-800`}
            />
          </div>
          <Toolbar
            story={currentStory}
            loadStory={this.loadStory}
            kind={currentKind}
            toggleSidebar={this.toggleSidebar}
            sidebarShowing={sidebarShowing}
          />
          <Frame className="" url={currentStory?.url} story={currentStory} />
          <Sidebar
            className={`fixed top-0 right-0 w-full lg:w-72 flex-0 bg-orange-50 transition-transform ${
              sidebarShowing
                ? "translate-x-0"
                : "translate-x-full lg:translate-x-0"
            }`}
            story={currentStory}
            stats={currentStats}
            user={currentUser}
            loading={loading}
          />
        </main>
      </div>
    );
  }

  toggleSidebar = () => {
    this.setState({ sidebarShowing: !this.state.sidebarShowing });
  };

  loadStory = async (storyType: StoryKind) => {
    if (this.state.loading) {
      return;
    }

    this.setState({
      lastError: undefined,
      loading: true,
      currentKind: storyType,
    });

    try {
      const res = await fetchWithTimeout(`/api/next?kind=${storyType}`, {
        method: "GET",
        headers: {
          "Accept-Encoding": "application/json",
        },
      });

      const apires: ExtendedAPIResult = await res.json();
      this.setState({
        currentStory: apires.story,
        currentStats: apires.stats,
        currentUser: apires.user,
        loading: false,
      });
    } catch (e) {
      this.setState({
        lastError: (e as Error).toString(),
        loading: false,
        currentStory: undefined,
        currentStats: undefined,
        currentUser: undefined,
      });
    }
  };
}

export default Home;
