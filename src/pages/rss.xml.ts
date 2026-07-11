import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { SITE } from "../config";
import { getPublishedEssays } from "../lib/essays";

export async function GET(context: APIContext) {
  const essays = await getPublishedEssays();

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: essays.map((essay) => ({
      title: essay.data.title,
      description: essay.data.description,
      pubDate: essay.data.pubDate,
      link: `/essays/${essay.id}/`,
    })),
  });
}
