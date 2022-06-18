import type { NextPage } from "next";
import Head from 'next/head';
import React, { useState } from 'react';

import { Frame } from '../components/Frame';
import { SpinnerIcon } from '../components/Icons';
import { NavBar } from '../components/NavBar';
import { Sidebar } from '../components/Sidebar';
import { APIResult, ExtendedAPIResult, Stats, Story, StoryKind, User } from '../store/types';
import { fetchWithTimeout } from '../util';

interface HomeState {
  currentStory?: Story;
  currentStats?: Stats;
  currentUser?: User;
  lastError?: string;
  loading: boolean;
}

class Home extends React.Component<NextPage, HomeState> {
  constructor(props: object) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  componentDidMount = () => {
    this.loadStory("top");
  };

  render() {
    const { currentStory, currentStats, currentUser, loading, lastError } =
      this.state;
    return (
      <div className="bg-white">
        <Head>
          <title>[RANDHN]</title>
          <meta name="description" content="Hacker News Roulette" />
          <meta name="viewport" content="initial-scale=1.0" />
          <link rel="icon" href="/favicon.ico" />
          <script
            src="https://cdn.usefathom.com/script.js"
            data-site="IZJULEST"
            defer
          ></script>
        </Head>

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
          <Frame
            className="flex-1"
            url={currentStory?.url}
            story={currentStory}
          />
          <Sidebar
            className="flex-0 bg-orange-50"
            story={currentStory}
            stats={currentStats}
            user={currentUser}
            loading={loading}
          />
        </main>
      </div>
    );
  }

  loadStory = async (storyType: StoryKind) => {
    if (this.state.loading) {
      return;
    }

    this.setState({
      lastError: undefined,
      loading: true,
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
