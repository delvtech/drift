import manifest from "@delvtech/drift/package.json" with { type: "json" };
import { defineConfig } from "vocs";

export default defineConfig({
  rootDir: ".",
  basePath: process.env.BASE_PATH,
  title: "Drift",
  titleTemplate: "%s // Drift",
  description:
    "Effortless Ethereum Development Across Web3 Libraries with caching, hooks, and mocks.",
  aiCta: {
    query() {
      let msg = `Research and analyze this page: ${window.location} so I can `;
      msg += "ask you questions about it. Use the information on the site to ";
      msg += "answer my questions. If you don't know the answer, say 'I don't ";
      msg += "know'.";
      return msg;
    },
  },
  editLink: {
    pattern: "https://github.com/delvtech/drift/edit/main/docs/pages/:path",
    text: "Edit this page",
  },
  topNav: [
    {
      text: "Examples",
      link: "https://github.com/delvtech/drift/tree/main/examples",
    },
    {
      text: manifest.version,
      items: [
        {
          text: "Changelog",
          link: "https://github.com/delvtech/drift/blob/main/packages/drift/CHANGELOG.md",
        },
      ],
    },
    {
      element: (
        <a
          key="github-link"
          className="heading-icon-link"
          href="https://github.com/delvtech/drift"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 98 96"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>GitHub</title>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
              fill="currentColor"
            ></path>
          </svg>
        </a>
      ),
    },
  ],
  sidebar: [
    {
      text: "Overview",
      link: "/",
    },
    {
      text: "Fundamentals",
      items: [
        {
          text: "Getting Started",
          link: "/getting-started",
        },
        {
          text: "Core Concepts",
          link: "/core-concepts",
        },
      ],
    },
    {
      text: "Guides",
      collapsed: false,
      items: [
        {
          text: "Reading Data",
          link: "/guides/reading-data",
        },
        {
          text: "Writing Data",
          link: "/guides/writing-data",
        },
        {
          text: "Events",
          link: "/guides/events",
        },
        {
          text: "Testing Strategies",
          link: "/guides/testing-strategies",
        },
        {
          text: "Caching",
          link: "/guides/caching",
        },
        {
          text: "Extending Drift",
          link: "/guides/extending-drift",
        },
      ],
    },
    {
      text: "Integration Patterns",
      collapsed: false,
      items: [
        {
          text: "React Query",
          link: "/integration-patterns/react-query",
        },
        {
          text: "Protocol SDKs",
          link: "/integration-patterns/protocol-sdks",
        },
      ],
    },
    {
      text: "Reference",
      collapsed: false,
      items: [
        {
          text: "API Reference",
          link: "/reference/api",
        },
        {
          text: "Examples",
          link: "/reference/examples",
        },
        {
          text: "Community",
          link: "/reference/community",
        },
      ],
    },
  ],
});
