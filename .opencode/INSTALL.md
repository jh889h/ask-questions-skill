# Installing Ask-Questions Skill for OpenCode

## Prerequisites

- [OpenCode.ai](https://opencode.ai) installed

## Installation

Add ask-questions to the `plugin` array in your `opencode.json` (global or project-level):

```json
{
  "plugin": ["ask-questions@git+https://git.zzlan.de/share/coding-agent-skills/ask-questions-skill.git"]
}
```

Restart OpenCode. The plugin auto-installs and registers the skill.

## Verify

Ask: "What skills do you have available?"

The `ask-questions` skill should be listed.

## What it does

This skill enforces interactive behavior before any code-affecting work:
- Asks questions before implementation steps
- Asks questions when anything is unclear
- Asks questions before moving from planning to execution
- Asks questions when multiple options exist
- Asks questions before making important assumptions
- Asks questions when the task appears complete
- Never concludes without a next-step question