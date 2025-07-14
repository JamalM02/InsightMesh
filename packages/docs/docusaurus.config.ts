import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import type * as Plugin from "@docusaurus/types/src/plugin";
import type * as OpenApiPlugin from "docusaurus-plugin-openapi-docs";

const config: Config = {
  future: {
    v4: true
  },
  title: 'InsightMesh Docs',
  tagline:
    "Welcome to the Events developer hub. You'll find comprehensive guides and documentation to help you start working with Events as quickly as possible, as well as support if you get stuck. Let's jump right in!",
  url: "https://events.com",
  baseUrl: "/docs/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/logo.svg",
  organizationName: "Events.com",
  projectName: "Events.com",
  markdown: {
    mermaid: true,
  },
  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          docItemComponent: "@theme/ApiItem",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    docs: {
      sidebar: {
        hideable: false,
      },
    },
    navbar: {
      title: "Events",
      logo: {
        alt: "logo",
        src: "img/docusaurus.png",
      },
      items: [
        {
          type: "doc",
          docId: "api/overview",
          position: "left",
          label: "API",
        },
      ],
    },
    prism: {
      additionalLanguages: [
        "ruby",
        "csharp",
        "php",
        "java",
        "powershell",
        "json",
        "bash",
        "dart",
        "objectivec",
        "r",
        "javascript",
        "typescript",
      ],
    },
    languageTabs: [
      {
        highlight: "curl",
        language: "curl",
        logoClass: "curl",
      },
      {
        highlight: "javascript",
        language: "nodejs",
        logoClass: "nodejs",
      },
      {
        highlight: "python",
        language: "python",
        logoClass: "python",
      },
      {
        highlight: "go",
        language: "go",
        logoClass: "go",
      },
      {
        highlight: "php",
        language: "php",
        logoClass: "php",
      },
      {
        highlight: "csharp",
        language: "csharp",
        logoClass: "csharp",
      },
    ],
  } satisfies Preset.ThemeConfig,

  plugins: [
    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "openapi",
        docsPluginId: "classic",
        config: {
          events: {
            specPath: "api/events.yaml",
            // proxy: "http://localhost:5500",
            outputDir: "docs/api/events",
            sidebarOptions: {
              groupPathsBy: "tag",
              categoryLinkSource: "tag",
            },
            // baseUrl: "http://localhost:5500",
            template: "api.mustache", // Customize API MDX with mustache template
            downloadUrl: "api/events.yaml",
            hideSendButton: false,
            showSchemas: true,
          } satisfies OpenApiPlugin.Options,
        } satisfies Plugin.PluginOptions,
      },
    ],
  ],
  themes: [
    "docusaurus-theme-openapi-docs",
    "@docusaurus/theme-mermaid",
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      {
        hashed: true,
      },
    ],
  ],
  stylesheets: [
    {
      href: "https://use.fontawesome.com/releases/v5.11.0/css/all.css",
      type: "text/css",
    },
  ],
};

export default async function createConfig() {
  return config;
}
