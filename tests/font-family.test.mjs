import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the global stylesheet loads the complete rounded Chinese font", async () => {
  const stylesheet = await readFile(new URL("../src/styles/global.css", import.meta.url), "utf8");

  assert.match(stylesheet, /@font-face\s*\{/);
  assert.match(stylesheet, /font-family:\s*"ChillRoundF"/);
  assert.match(stylesheet, /@fontpkg\/chill-round-f\/ChillRoundF\.ttf/);
});
