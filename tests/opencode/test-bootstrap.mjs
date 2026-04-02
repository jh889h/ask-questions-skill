import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const repoRoot = path.resolve(import.meta.dirname, "..", "..");
const pluginPath = path.join(repoRoot, ".opencode", "plugins", "ask-questions.js");
const skillPath = path.join(repoRoot, "skills", "ask-questions", "SKILL.md");

const fail = (message) => {
  console.error(`[FAIL] ${message}`);
  process.exit(1);
};

const pass = (message) => {
  console.log(`[PASS] ${message}`);
};

const stripFrontmatter = (content) => {
  const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  return match ? match[1] : content;
};

const { AskQuestionsPlugin } = await import(pathToFileURL(pluginPath).href);
const plugin = await AskQuestionsPlugin({ client: {}, directory: repoRoot });

if (typeof plugin["experimental.chat.messages.transform"] !== "function") {
  fail("plugin did not expose experimental.chat.messages.transform");
}
pass("plugin exposes the chat message transform hook");

const transform = plugin["experimental.chat.messages.transform"];
const skillContent = stripFrontmatter(fs.readFileSync(skillPath, "utf8")).trim();

const output = {
  messages: [
    {
      info: { role: "user" },
      parts: [{ type: "text", text: "Please implement the feature." }]
    }
  ]
};

await transform({}, output);

const firstUser = output.messages[0];
const injected = firstUser.parts[0];

if (injected.type !== "text") {
  fail("transform did not inject a text part");
}
pass("transform injects a text part");

if (!injected.text.includes("<EXTREMELY_IMPORTANT>")) {
  fail("bootstrap marker was not injected");
}
pass("bootstrap marker is injected");

if (!injected.text.includes("ask-questions skill is ALREADY LOADED")) {
  fail("bootstrap text is missing the already-loaded guidance");
}
pass("bootstrap text includes the already-loaded guidance");

if (!injected.text.includes(skillContent)) {
  fail("bootstrap text is missing the skill body");
}
pass("bootstrap text includes the skill body");

const partCountAfterFirstTransform = firstUser.parts.length;
await transform({}, output);

if (firstUser.parts.length !== partCountAfterFirstTransform) {
  fail("transform injected bootstrap more than once");
}
pass("transform is idempotent for the first user message");

console.log("All bootstrap checks passed.");
