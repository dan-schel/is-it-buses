import type { KnipConfig } from "knip";

const config: KnipConfig = {
  // `main.ts` is automatically detected by Knip as an entry point, so no need
  // to include it here.
  entry: ["scripts/generate-map-geometry/index.ts"],
  ignoreDependencies: [
    "@vitest/coverage-v8",

    // Tailwind docs say to install both tailwindcss and @tailwindcss/vite
    // packages: https://tailwindcss.com/docs/installation/using-vite.
    "tailwindcss",
  ],
};

export default config;
