# Ask-Questions Skill for OpenCode

A skill that enforces interactive behavior before any code-affecting work.

## Installation

Tell OpenCode:

```
Fetch and follow instructions from https://git.zzlan.de/share/coding-agent-skills/ask-questions-skill/-/raw/master/.opencode/INSTALL.md?ref_type=heads
```

Or manually add to your `opencode.json`:

```json
{
  "plugin": ["git+https://git.zzlan.de/share/coding-agent-skills/ask-questions-skill.git"]
}
```

Restart OpenCode. The plugin auto-installs from the git repository and registers the skill.

If the plugin is not discovered, make sure the repository includes the package entry point OpenCode expects:

```json
{
  "name": "ask-questions",
  "type": "module",
  "main": ".opencode/plugins/ask-questions.js"
}
```

## What it does

This skill is a mandatory interactive gate for code-affecting work only. It requires:

- Questions before any implementation step
- Questions when anything is unclear
- Questions before moving from planning to execution
- Questions when multiple reasonable options exist
- Questions before making important assumptions
- Questions when the task appears complete
- Never ends without an interactive next-step question

## OpenCode Plugin Tests

There is now a minimal OpenCode plugin test harness in `tests/opencode/`.

Run:

```bash
tests/opencode/run-tests.sh
```

On Windows, run:

```powershell
node tests/opencode/run-tests.mjs
# or
powershell -ExecutionPolicy Bypass -File tests/opencode/run-tests.ps1
```

You can also use:

```bash
npm run test:opencode
```

It verifies the package entry point, plugin export, installed skills-path registration, bootstrap injection, and duplicate-injection protection. The shell scripts remain available as a Unix-style install-layout check.

## License

MIT
