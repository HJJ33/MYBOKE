# 古月随笔 Design Specification

## Goal

Create a calm, static personal essay blog named `古月随笔`. The site records personal writing and is maintained through Markdown files.

## Architecture

The site uses Astro with TypeScript and Astro content collections. Markdown entries under `src/content/essays/` provide article data and body content. Astro pages derive the homepage, archive, tags, article detail pages, RSS feed, sitemap, and page metadata from that collection.

## Information Architecture

- **Home:** Site introduction and essays in reverse chronological order. Each entry shows date, title, description, tags, and reading time.
- **Essay:** Readable long-form layout with article metadata, tags, previous and next entries, and a link back home.
- **Archive:** Essays grouped by year.
- **Tags:** All tags with their entry counts, plus one route per tag listing matching entries.
- **About:** States: “因为姓胡所以懒得起昵称，一直叫古月。博客只是记录自己随笔。”

## Content

Each entry is a Markdown file with validated frontmatter:

- `title`: required article title.
- `description`: required short summary.
- `pubDate`: required publication date.
- `tags`: required list of tags.
- `draft`: optional boolean, defaulting to `false`.
- `cover`: optional local image path.

Drafts never appear in production pages, RSS, or sitemap. Reading time is calculated from rendered article text.

## Visual System

The direction follows the supplied Bokushi reference: content-first, paper-like, spacious, and calm. It uses a blue-green reinterpretation rather than warm earth tones.

- Light theme only; no theme toggle or dark-mode styles.
- A misty white page background, white surfaces, deep teal-blue text, lake-blue links, and cyan-blue accents.
- 17px Chinese-friendly body type with `jf-openhuninn-2.0` first and reliable system fallbacks.
- A constrained long-form measure, generous vertical rhythm, and restrained borders and shadows.
- Components use semantic CSS variables exposed to Tailwind utility classes. Astro components never introduce raw color literals.
- Hover states only change color, border, or shadow; they never lift content vertically.
- Respect `prefers-reduced-motion`.

## Responsive and Accessibility Requirements

- Use a 72rem outer page shell and a roughly 68ch reading measure.
- Keep the default mobile layout single-column with 16px horizontal padding; expand to 24px at 640px and above.
- Provide a keyboard-accessible mobile navigation control.
- Use semantic landmarks, visible focus indicators, meaningful page titles, descriptions, and a canonical URL supplied by site configuration.

## Tooling and Quality

- Astro with TypeScript, Tailwind CSS, and `@astrojs/rss` / `@astrojs/sitemap`.
- Biome owns formatting and linting with scripts for checking and formatting.
- Validate with `biome check`, `astro check`, and a production `astro build`.

## Initial Content

Seed several Chinese essays so all index, archive, and tag views are populated on first run. The examples demonstrate the expected Markdown frontmatter and reading layout.
