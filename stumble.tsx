/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { Component, h, renderSSR } from 'https://deno.land/x/nano_jsx@v0.0.32/mod.ts';
import { setup } from 'https://esm.sh/twind@0.16.16';
import * as colors from 'https://esm.sh/twind@0.16.16/colors';
import { getStyleTag, virtualSheet } from 'https://esm.sh/twind@0.16.16/sheets';

import { Bar } from './ui/bar.tsx';

const sheet = virtualSheet();

setup({
  theme: {
    extend: {
      colors,
    },
  },
  sheet,
});

class App extends Component {
  url: string = "https://deno.land";

  constructor(props: any) {
    super(props);

    this.url = props.url;
  }

  render() {
    return (
      <div>
        <Bar />
        <iframe
          style="width: 100%; height: calc(100vh - 32px); margin-top: 32px; border: none; padding: 0;"
          src={this.url}
          title="description"
          sandbox
        ></iframe>
      </div>
    );
  }
}

export async function handleHTML(story: any): Promise<Response> {
  sheet.reset();

  const body = renderSSR(<App url={story.url} />);
  const styleTag = getStyleTag(sheet);

  return new Response(
    `<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>HNTrip</title>
        ${styleTag}
      </head>
      <body>
        ${body}
      </body>
    </html>`,
    {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    }
  );
}
