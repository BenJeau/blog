import { z, defineCollection } from "astro:content";

export const collections = {
  blogs: defineCollection({
    type: "content",
    schema: ({ image }) =>
      z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
        cover: image(),
        coverAlt: z.string(),
        coverLink: z.string().url().optional(),
        tags: z.array(z.string()),
      }),
  }),
};
