import { type CollectionEntry, getCollection } from "astro:content";

export type Essay = CollectionEntry<"essays">;

export async function getPublishedEssays() {
  const entries = await getCollection("essays", ({ data }) => !data.draft);
  return entries.sort((left, right) => right.data.pubDate.valueOf() - left.data.pubDate.valueOf());
}

export function getReadingTime(essay: Essay) {
  const characterCount = (essay.body ?? "").replace(/\s/g, "").length;
  return Math.max(1, Math.ceil(characterCount / 400));
}

export function getTags(essays: Essay[]) {
  const counts = new Map<string, number>();

  for (const essay of essays) {
    for (const tag of essay.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts].sort(([left], [right]) => left.localeCompare(right, "zh-CN"));
}

export function getEssaysByTag(essays: Essay[], tag: string) {
  return essays.filter((essay) => essay.data.tags.includes(tag));
}

export function getArchives(essays: Essay[]) {
  const archives = new Map<number, Essay[]>();

  for (const essay of essays) {
    const year = essay.data.pubDate.getFullYear();
    archives.set(year, [...(archives.get(year) ?? []), essay]);
  }

  return [...archives.entries()].sort(([left], [right]) => right - left);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
