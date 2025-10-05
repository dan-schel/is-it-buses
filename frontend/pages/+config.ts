import vikeReact from "vike-react/config";
import type { Config } from "vike/types";
import Layout from "@/frontend/layouts/LayoutDefault.jsx";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/Layout
  Layout,

  // https://vike.dev/head-tags
  title: "Is it buses?",
  description: "Melbourne's train disruptions, visualised",

  extends: vikeReact,

  // Allows us to have a /frontend folder, but still treat this folder as
  // the root for filesystem-based routing.
  filesystemRoutingRoot: "/",

  passToClient: ["client"],
} satisfies Config;
