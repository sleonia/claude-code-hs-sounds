---
name: play-sound
description: Play all notification sounds to test your soundpack
prefix-required: true
allowed-tools:
  - Bash
  - AskUserQuestion
---

# Test All Sounds

Test sounds by running the plugin playback commands directly.

## Instructions

Use a single Bash tool call for testing the soundpack.

```bash
node dist/claude/src/index.mjs
```

Then ask the user which sounds they heard and whether any were missing or incorrect.
