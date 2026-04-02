import fs from "fs";
import os from "os";
import path from "path";
import { pathToFileURL } from "url";

const repoRoot = path.resolve(import.meta.dirname, "..", "..");
const packagePath = path.join(repoRoot, "package.json");
const pluginPath = path.join(repoRoot, ".opencode", "plugins", "ask-questions.js");
const skillPath = path.join(repoRoot, "skills", "ask-questions", "SKILL.md");

const fail = (message) => {
  console.error(`[FAIL] ${message}`);
  process.exit(1);
};

const pass = (message) => {
  console.log(`[PASS] ${message}`);
};

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

if (packageJson.name !== "ask-questions") {
  fail(`package name mismatch: expected "ask-questions", got ${JSON.stringify(packageJson.name)}`);
}
pass("package name is ask-questions");

if (packageJson.type !== "module") {
  fail(`package type mismatch: expected "module", got ${JSON.stringify(packageJson.type)}`);
}
pass("package type is module");

if (packageJson.main !== ".opencode/plugins/ask-questions.js") {
  fail(`package main mismatch: expected .opencode/plugins/ask-questions.js, got ${JSON.stringify(packageJson.main)}`);
}
pass("package main points to the plugin entry");

if (!fs.existsSync(pluginPath)) {
  fail(`plugin file not found at ${pluginPath}`);
}
pass("plugin file exists");

if (!fs.existsSync(skillPath)) {
  fail(`skill file not found at ${skillPath}`);
}
pass("skill file exists");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ask-questions-opencode-"));

try {
  const installRoot = path.join(tempDir, "ask-questions");
  const installedPluginPath = path.join(installRoot, ".opencode", "plugins", "ask-questions.js");
  const installedSkillsDir = path.join(installRoot, "skills");
  const installedPackagePath = path.join(installRoot, "package.json");

  fs.mkdirSync(path.dirname(installedPluginPath), { recursive: true });
  fs.cpSync(path.join(repoRoot, "skills"), installedSkillsDir, { recursive: true });
  fs.copyFileSync(pluginPath, installedPluginPath);
  fs.copyFileSync(packagePath, installedPackagePath);

  const { AskQuestionsPlugin } = await import(pathToFileURL(installedPluginPath).href);
  if (typeof AskQuestionsPlugin !== "function") {
    fail("plugin module does not export AskQuestionsPlugin");
  }
  pass("plugin exports AskQuestionsPlugin");

  const plugin = await AskQuestionsPlugin({ client: {}, directory: installRoot });
  if (!plugin || typeof plugin.config !== "function") {
    fail("plugin did not expose a config hook");
  }
  pass("plugin exposes a config hook");

  const config = {};
  await plugin.config(config);
  const expectedSkillsPath = path.join(installRoot, "skills");

  if (!Array.isArray(config.skills?.paths)) {
    fail("config hook did not create skills.paths");
  }
  if (!config.skills.paths.includes(expectedSkillsPath)) {
    fail(`config hook did not register installed skills path ${expectedSkillsPath}`);
  }
  pass("config hook registers the installed skills path");
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

console.log("All plugin loading checks passed.");
