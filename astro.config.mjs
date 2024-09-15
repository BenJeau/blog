import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import remarkToc from "remark-toc";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";

import { remarkReadingTime } from "./remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  markdown: {
    remarkPlugins: [[remarkToc, { heading: "contents" }], remarkReadingTime],
    rehypePlugins: [rehypeAccessibleEmojis],
  },
});
