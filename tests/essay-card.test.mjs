import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("essay cards expose a full-card article link", async () => {
  const component = await readFile(
    new URL("../src/components/EssayCard.astro", import.meta.url),
    "utf8",
  );

  assert.match(component, /class="essay-card-link"/);
  assert.match(component, /aria-label={`阅读：\$\{essay\.data\.title\}`}/);
});
