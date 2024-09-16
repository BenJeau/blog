import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const blogs = await getCollection("blogs");
  return rss({
    title: "Benoît Jeaurond's blog",
    description:
      "A place for me to write about what interests me and what I'm learning.",
    site: context.site!,
    items: blogs.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      categories: post.data.tags,
      author: "Benoît Jeaurond",
      link: `/${post.slug}/`,
      enclosure: {
        url: `/${post.slug}/og.png`,
        length: 0,
        type: "image/png",
      },
    })),
    customData: `<language>en-us</language>`,
  });
}
