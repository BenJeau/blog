import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import remarkToc from "remark-toc";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";

import { remarkReadingTime } from "./src/remark-reading-time.mjs";
import { og } from "./src/astro/og-plugin";
import { siteUrl } from "./src/content";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  integrations: [sitemap(), og(), mdx()],
  markdown: {
    remarkPlugins: [[remarkToc, { heading: "contents" }], remarkReadingTime],
    rehypePlugins: [rehypeAccessibleEmojis],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: true,
});