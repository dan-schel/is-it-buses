import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import vike from "vike/plugin";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const pwaConfig: Partial<VitePWAOptions> = {
  // TODO: It looks like there's no way to create a custom "You're offline" page
  // without implementing a custom service worker. Might leave that for later!

  // I'm pretty sure it doesn't matter what we set this to, because we're not
  // precaching HTML, and stuff in the "assets" folder have hashes added to
  // their filenames. This might become relevant for things in the public
  // directory though.
  registerType: "autoUpdate",

  // VitePWA doesn't automatically add the script tag to the HTML (it doesn't
  // seem to know how to deal with Vike), but we still need it to generate
  // `registerSW.js` for us.
  injectRegister: "script",

  // There's no HTML to pre-cache because it's generated dynamically with SSR.
  // This doesn't seem to work for stuff in the public directory. They need to
  // go in `includeAssets` instead.
  workbox: {
    globPatterns: ["**/*.{js,css,ico,png,svg}"],
  },

  includeAssets: [
    // Anything else in the public folder we want to be precached. No need to
    // include the manifest icons here though, they're included by default.
    // "/whatever.woff2",
  ],

  manifest: {
    name: "Is it buses?",
    short_name: "Is it buses?",
    description: "Melbourne's train disruptions, visualised",

    // Acts as a default value for 'theme-color' if not set in the HTML.
    // Probably not needed in our case?
    theme_color: "#ffffff",

    // Splash screen background color.
    background_color: "#ffffff",

    // Icons generated using https://favicon.inbrowser.app/tools/favicon-generator.
    icons: [
      {
        src: "/pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/pwa-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  },
};

export default defineConfig({
  plugins: [
    // Omit the Vike plugin when running the tests, otherwise it complains in
    // the output.
    !process.env.VITEST && vike({}),

    react({}),
    VitePWA(pwaConfig),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
