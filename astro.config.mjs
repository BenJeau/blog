import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";

import { remarkReadingTime } from "./src/remark-reading-time.mjs";
import { og } from "./src/og-creation";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.jeaurond.dev",
  integrations: [tailwind(), sitemap(), og()],
  markdown: {
    remarkPlugins: [[remarkToc, { heading: "contents" }], remarkReadingTime],
    rehypePlugins: [rehypeAccessibleEmojis],
  },
  prefetch: true,
});
