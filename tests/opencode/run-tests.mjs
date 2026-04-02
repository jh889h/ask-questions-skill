import { spawnSync } from "child_process";
import path from "path";

const tests = [
  "test-plugin-loading.mjs",
  "test-bootstrap.mjs"
];

for (const testFile of tests) {
  const testPath = path.resolve(import.meta.dirname, testFile);
  const result = spawnSync(process.execPath, [testPath], { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("All OpenCode tests passed.");
