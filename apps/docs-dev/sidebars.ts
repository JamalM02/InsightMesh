import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";
import eventsSidebar from "./docs/api/events/sidebar";

const sidebars: SidebarsConfig = {
  api: [
    {
      type: "doc",
      id: "api/overview",
    },
    {
      type: "category",
      label: "Events",
      items: [eventsSidebar],
    },
  ],
};

export default sidebars;
