import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api/events/events-api",
    },
    {
      type: "category",
      label: "Events",
      items: [
        {
          type: "doc",
          id: "api/events/create-event-v-1",
          label: "Create a new event",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Schemas",
      items: [
        {
          type: "doc",
          id: "api/events/schemas/createeventrequest",
          label: "CreateEventRequest",
          className: "schema",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
