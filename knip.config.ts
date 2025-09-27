import type { KnipConfig } from "knip";

const config: KnipConfig = {
  // `main.ts` is automatically detected by Knip as an entry point, so no need
  // to include it here.
  entry: ["scripts/generate-map-geometry/index.ts"],
};

export default config;
