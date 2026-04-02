# Ask-Questions Skill for OpenCode

A skill that enforces interactive behavior before any code-affecting work.

## Installation

Add to your `opencode.json`:

```json
{
  "plugin": ["ask-questions@git+ssh://git@git.zzlan.de/share/coding-agent-skills/ask-questions-skill.git"]
}
```

Restart OpenCode.

## What it does

This skill is a mandatory interactive gate for code-affecting work only. It requires:

- Questions before any implementation step
- Questions when anything is unclear
- Questions before moving from planning to execution
- Questions when multiple reasonable options exist
- Questions before making important assumptions
- Questions when the task appears complete
- Never ends without an interactive next-step question

## License

MIT