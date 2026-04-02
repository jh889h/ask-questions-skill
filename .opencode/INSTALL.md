# Installing Ask-Questions Skill for OpenCode

## Installation

Add ask-questions to the `plugin` array in your `opencode.json` (global or project-level):

```json
{
  "plugin": ["ask-questions@git+https://github.com/YOUR_USERNAME/ask-questions-skill.git"]
}
```

Replace `YOUR_USERNAME` with your GitHub username or the correct repository path.

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
- Never concludes without a next-step question