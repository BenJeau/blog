import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

import { siteTitle, siteDescription } from "@/content";

export async function GET(context: APIContext) {
  const blogs = await getCollection("blogs");
  const blogsSorted = blogs.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  const visibleBlogs = blogsSorted.filter((blog) => !blog.data.isDraft);
  return rss({
    title: siteTitle,
    description: siteDescription,
    site: context.site!,
    items: visibleBlogs.map((post) => ({
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
