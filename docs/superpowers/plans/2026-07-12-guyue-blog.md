# 古月随笔 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a blue-green, Markdown-maintained personal essay blog with Astro, Tailwind CSS, and Biome.

**Architecture:** Astro content collections validate Markdown essays and supply all routes. Shared layouts and components apply a token-based visual system; listing helpers derive filtered, ordered essay collections for home, archive, tags, RSS, and sitemap.

**Tech Stack:** Astro, TypeScript, Tailwind CSS, Astro content collections, `@astrojs/rss`, `@astrojs/sitemap`, Biome.

## Global Constraints

- Use the Chinese blog name `古月随笔` and the supplied About-page copy verbatim.
- Keep only a light theme; do not implement a theme toggle or dark-mode styles.
- Use `jf-openhuninn-2.0` first with Chinese-friendly system fallbacks and a 17px base size.
- Use semantic CSS variables for component colors and map them to Tailwind utilities; do not use raw colors in Astro component markup.
- Keep hover effects limited to color, border, and shadow changes.
- Provide accessible semantic HTML, keyboard navigation, focus-visible styles, and reduced-motion support.
- Validate the final result with `biome check`, `astro check`, and `astro build`.

---

## File Structure

- `package.json`, `astro.config.mjs`, `tsconfig.json`, `biome.json`: application, framework, and quality-tool configuration.
- `src/config.ts`: canonical site identity and URL.
- `src/content.config.ts`, `src/content/essays/*.md`: content schema and initial article sources.
- `src/styles/global.css`: Tailwind import, semantic tokens, typography, component primitives, and responsive styles.
- `src/layouts/BaseLayout.astro`, `src/layouts/EssayLayout.astro`: shared document shell and essay reading layout.
- `src/components/Header.astro`, `src/components/EssayCard.astro`, `src/components/TagList.astro`: reusable navigation and presentation units.
- `src/lib/essays.ts`: content-listing, tag, archive, and reading-time helpers.
- `src/pages/**`: public pages, dynamic essay/tag pages, and RSS endpoint.

## Task 1: Scaffold the Astro application and quality tooling

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `biome.json`
- Create: `src/config.ts`

**Interfaces:**
- Produces: `SITE` object with `title`, `description`, and `url` for layouts and RSS.

- [ ] **Step 1: Create the project manifest and install dependencies**

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "check": "astro check",
    "lint": "biome check .",
    "format": "biome format --write ."
  }
}
```

Run: `npm install`
Expected: dependencies for Astro, Tailwind, RSS, sitemap, and Biome are installed.

- [ ] **Step 2: Configure Astro, TypeScript, Biome, and site data**

```ts
export const SITE = {
  title: "古月随笔",
  description: "记录自己随笔。",
  url: "https://example.com",
} as const;
```

Run: `npm run check`
Expected: Astro reports no TypeScript configuration errors.

## Task 2: Build the global blue-green design system

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`

**Interfaces:**
- Consumes: `SITE` from `src/config.ts`.
- Produces: `BaseLayout` accepting `title` and `description` props, and `Header` navigation used by every route.

- [ ] **Step 1: Define Tailwind import and semantic CSS tokens**

```css
@import "tailwindcss";

:root {
  --color-bg-page: #f4fbfb;
  --color-bg-surface: #ffffff;
  --color-text-primary: #12333d;
  --color-accent: #1596a8;
}
```

- [ ] **Step 2: Implement the accessible document shell and responsive navigation**

```astro
<BaseLayout title="古月随笔" description="记录自己随笔。">
  <main class="page-shell"><slot /></main>
</BaseLayout>
```

Run: `npm run build`
Expected: Astro emits a static build with the shared layout available.

## Task 3: Add validated Markdown essays and content helpers

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/essays/雨后散步.md`
- Create: `src/content/essays/给夏天的一封信.md`
- Create: `src/content/essays/慢慢生活.md`
- Create: `src/lib/essays.ts`

**Interfaces:**
- Produces: `getPublishedEssays()`, `getTags()`, `getEssaysByTag(tag)`, `getArchives()`, and `getReadingTime(entry)`.
- Consumes: the `essays` collection with frontmatter `title`, `description`, `pubDate`, `tags`, `draft`, and optional `cover`.

- [ ] **Step 1: Define the collection schema and seed three published essays**

```ts
const essays = defineCollection({
  loader: glob({ base: "./src/content/essays", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});
```

- [ ] **Step 2: Implement deterministic collection helpers**

```ts
export async function getPublishedEssays() {
  const entries = await getCollection("essays", ({ data }) => !data.draft);
  return entries.sort((left, right) => right.data.pubDate.valueOf() - left.data.pubDate.valueOf());
}
```

Run: `npm run check`
Expected: the content collection and helper types compile successfully.

## Task 4: Implement listings, articles, archives, tags, and About

**Files:**
- Create: `src/components/EssayCard.astro`
- Create: `src/components/TagList.astro`
- Create: `src/layouts/EssayLayout.astro`
- Create: `src/pages/index.astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/archive.astro`
- Create: `src/pages/tags/index.astro`
- Create: `src/pages/tags/[tag].astro`
- Create: `src/pages/essays/[...slug].astro`

**Interfaces:**
- Consumes: `BaseLayout`, essay helpers, and the `essays` collection.
- Produces: all public page routes with article navigation and paginated-free lists.

- [ ] **Step 1: Create reusable essay cards, tag links, and reading layout**

```astro
<article class="surface-card">
  <time datetime={essay.data.pubDate.toISOString()}>{formattedDate}</time>
  <h2><a href={`/essays/${essay.id}/`}>{essay.data.title}</a></h2>
  <p>{essay.data.description}</p>
</article>
```

- [ ] **Step 2: Build static list pages and dynamic article/tag routes**

```ts
export async function getStaticPaths() {
  const essays = await getPublishedEssays();
  return essays.map((essay) => ({ params: { slug: essay.id }, props: { essay } }));
}
```

- [ ] **Step 3: Include canonical titles, descriptions, dates, article links, and previous/next navigation**

Run: `npm run build`
Expected: all home, archive, tags, about, and essay routes render successfully.

## Task 5: Add discovery endpoints and validate the application

**Files:**
- Create: `src/pages/rss.xml.ts`
- Modify: `astro.config.mjs`
- Modify: `README.md`

**Interfaces:**
- Consumes: `SITE` and `getPublishedEssays()`.
- Produces: `/rss.xml`, `/sitemap-index.xml`, and setup instructions.

- [ ] **Step 1: Add the RSS endpoint and sitemap integration**

```ts
export async function GET(context: APIContext) {
  const essays = await getPublishedEssays();
  return rss({
    title: SITE.title,
    site: context.site ?? SITE.url,
    items: essays.map((essay) => ({ title: essay.data.title, link: `/essays/${essay.id}/` })),
  });
}
```

- [ ] **Step 2: Document local development and update the production URL instruction**

```md
npm install
npm run dev
npm run lint
npm run check
npm run build
```

- [ ] **Step 3: Run quality and build validation**

Run: `npm run lint`
Expected: Biome completes with no diagnostics.

Run: `npm run check`
Expected: Astro type and content checks pass.

Run: `npm run build`
Expected: static pages, RSS, and sitemap build without errors.
