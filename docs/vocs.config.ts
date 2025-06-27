import { defineConfig } from "vocs";

export default defineConfig({
  rootDir: ".",
  title: "Drift",
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
