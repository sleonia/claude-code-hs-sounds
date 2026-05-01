---
name: play-sound
description: Play all notification sounds to test your soundpack
prefix-required: true
allowed-tools:
  - Bash
  - AskUserQuestion
---

# Test All Sounds

Test sounds by running the plugin playback commands directly. No futher output should be added.

## Instructions

Use a single Bash tool call for testing the soundpack.

```bash
node ${CLAUDE_PLUGIN_ROOT}/src/index.mjs
```

