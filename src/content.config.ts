import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const essays = defineCollection({
  loader: glob({ base: "./src/content/essays", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).min(1),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

export const collections = { essays };
