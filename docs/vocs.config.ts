import { defineConfig } from "vocs";
import manifest from "../packages/drift/package.json";

export default defineConfig({
  rootDir: ".",
  title: "Drift",
  titleTemplate: "%s // Drift",
  description:
    "Effortless Ethereum Development Across Web3 Libraries with caching, hooks, and mocks.",
  editLink: {
    pattern: "https://github.com/delvtech/drift/edit/main/site/pages/:path",
    text: "Edit this page",
  },
  socials: [
    {
      icon: "github",
      link: "https://github.com/delvtech/drift",
    },
  ],
  topNav: [
    { text: "Docs", link: "/getting-started", match: "/docs" },
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
      ],
    },
    {
      text: "Advanced",
      items: [
        {
          text: "Caching",
          link: "/advanced/caching",
        },
        {
          text: "Extending Drift",
          link: "/advanced/extending-drift",
        },
      ],
    },
    {
      text: "Integrations",
      items: [
        {
          text: "React Query",
          link: "/integrations/react-query",
        },
        {
          text: "SDK Layers",
          link: "/integrations/sdk-layers",
        },
        {
          text: "Multi-chain Deployments",
          link: "/integrations/multi-chain-deployments",
        },
      ],
    },
    {
      text: "Reference",
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
