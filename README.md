# 古月随笔

一个使用 Astro、Tailwind CSS 与 Biome 构建的个人随笔博客。中文界面自托管开源的寒蝉全圆体（OFL-1.1）。

## 本地开发

```bash
npm install
npm run dev
```

## 质量检查

```bash
npm run lint
npm run check
npm run build
```

文章位于 `src/content/essays/`，使用 Markdown 和 YAML frontmatter 编写。发布前请将 `astro.config.mjs` 与 `src/config.ts` 的 `site` URL 更新为实际域名。
