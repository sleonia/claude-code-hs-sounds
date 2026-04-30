# Sounds Inlining Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate meta.json file I/O and parsing at runtime by inlining the sounds array into index.mjs at build time.

**Architecture:** Build-time generator reads meta.json, flattens to sounds array, and generates index.mjs with inlined data. Runtime accesses array directly—zero disk I/O, zero parsing.

**Tech Stack:** Node.js (ES modules), fs module

---

### Task 1: Create generator script skeleton

**Files:**

- Create: `scripts/generate-index.mjs`

- [ ] **Step 1: Write basic generator with error handling**

```javascript
import fs from "fs";
import path from "path";

const META_JSON_PATH = "meta.json";
const OUTPUT_PATH = "dist/claude/src/index.mjs";
const TEMPLATE_PATH = "src/index.mjs";

function generate() {
  try {
    // Read and validate meta.json
    if (!fs.existsSync(META_JSON_PATH)) {
      console.error(`Error: ${META_JSON_PATH} not found`);
      process.exit(1);
    }

    const meta = JSON.parse(fs.readFileSync(META_JSON_PATH, "utf8"));

    // Extract all sound paths
    const sounds = [];
    for (const pack of Object.values(meta.packs)) {
      for (const card of pack) {
        for (const audioPath of card.audios) {
          sounds.push(audioPath);
        }
      }
    }

    if (sounds.length === 0) {
      console.error("Error: No sounds found in meta.json");
      process.exit(1);
    }

    console.log(`Found ${sounds.length} sounds`);

    // Read template
    if (!fs.existsSync(TEMPLATE_PATH)) {
      console.error(`Error: ${TEMPLATE_PATH} not found`);
      process.exit(1);
    }

    let template = fs.readFileSync(TEMPLATE_PATH, "utf8");

    // Replace placeholder with sounds array
    const soundsArrayLiteral = JSON.stringify(sounds);
    template = template.replace(
      "// __SOUNDS_ARRAY_PLACEHOLDER__",
      `const sounds = ${soundsArrayLiteral};`,
    );

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write generated file
    fs.writeFileSync(OUTPUT_PATH, template);
    console.log(`Generated ${OUTPUT_PATH} with ${sounds.length} sounds`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

generate();
```

- [ ] **Step 2: Run generator to verify it fails gracefully without template**

Run: `node scripts/generate-index.mjs`
Expected: Error "src/index.mjs not found"

- [ ] **Step 3: Commit**

```bash
git add scripts/generate-index.mjs
git commit -m "feat: add generator script skeleton with error handling

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 2: Create index.mjs template with placeholder

**Files:**

- Create: `src/index.mjs`

- [ ] **Step 1: Write handler template with sounds placeholder**

```javascript
import AudioPlayer from "./shared/audio-player.mjs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.join(__dirname, "..");

// __SOUNDS_ARRAY_PLACEHOLDER__

async function handler() {
  if (sounds.length === 0) {
    throw new Error("No sounds available");
  }
  const index = Math.floor(Math.random() * sounds.length);
  const soundPath = path.join(repoRoot, sounds[index]);
  await AudioPlayer.play(soundPath);
}

void handler();
```

- [ ] **Step 2: Run generator to verify output is created**

Run: `node scripts/generate-index.mjs`
Expected: "Generated dist/claude/src/index.mjs with N sounds"

- [ ] **Step 3: Verify generated file has sounds array**

Run: `head -20 dist/claude/src/index.mjs`
Expected: See `const sounds = ["soundpack/1...`

- [ ] **Step 4: Commit**

```bash
git add src/index.mjs
git commit -m "feat: add index.mjs template with sounds placeholder

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 3: Update package.json with build scripts

**Files:**

- Modify: `package.json`

- [ ] **Step 1: Add generate:index and update build scripts**

Add/modify scripts section:

```json
{
  "scripts": {
    "generate:index": "node scripts/generate-index.mjs",
    "build": "npm run generate:index && astro build",
    "dev": "npm run generate:index && astro dev",
    "test:sounds": "node dist/claude/src/index.mjs"
  }
}
```

- [ ] **Step 2: Run build to verify generator runs**

Run: `npm run build`
Expected: Build completes, index.mjs generated

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "feat: integrate generator into build scripts

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 4: Test generated file runs correctly

**Files:**

- Test: `dist/claude/src/index.mjs`

- [ ] **Step 1: Run generated index.mjs**

Run: `npm run test:sounds`
Expected: Sound plays, no errors

- [ ] **Step 2: Run multiple times to verify randomness**

Run: `npm run test:sounds` (repeat 3-5 times)
Expected: Different sounds play each time

- [ ] **Step 3: Commit**

```bash
git commit --allow-empty -m "test: verify generated index.mjs works correctly

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 5: Remove unused SoundSelector class

**Files:**

- Delete: `src/shared/sound-selector.mjs`

- [ ] **Step 1: Remove sound-selector.mjs**

Run: `rm src/shared/sound-selector.mjs`

- [ ] **Step 2: Verify build still works**

Run: `npm run build`
Expected: Build succeeds, no import errors

- [ ] **Step 3: Test runtime still works**

Run: `npm run test:sounds`
Expected: Sound plays

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: remove unused SoundSelector class

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 6: Verify .gitignore covers generated file

**Files:**

- Modify: `.gitignore`

- [ ] **Step 1: Check .gitignore for dist/ directory**

Run: `grep -q "^dist/" .gitignore && echo "dist/ is ignored" || echo "dist/ not ignored"`

- [ ] **Step 2: If not ignored, add dist/ to .gitignore**

Add to `.gitignore`:

```
dist/
```

- [ ] **Step 3: Verify generated file not in git**

Run: `git status`
Expected: `dist/claude/src/index.mjs` not shown as untracked

- [ ] **Step 4: Commit if .gitignore was modified**

```bash
git add .gitignore
git commit -m "chore: ensure dist/ directory is ignored

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 7: Test with modified meta.json

**Files:**

- Test: `meta.json` modification

- [ ] **Step 1: Add a temporary test sound to meta.json**

Modify `meta.json` temporarily (add duplicate entry to existing card's audios array)

- [ ] **Step 2: Rebuild**

Run: `npm run build`
Expected: "Found N+1 sounds" message

- [ ] **Step 3: Verify sound count increased**

Run: `grep -o 'sounds.length' dist/claude/src/index.mjs | wc -l` or check sounds array length
Expected: Array length reflects new sound count

- [ ] **Step 4: Restore meta.json**

Run: `git checkout meta.json`

- [ ] **Step 5: Commit**

```bash
git commit --allow-empty -m "test: verify generator updates with meta.json changes

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 8: Cleanup and final verification

**Files:**

- All project files

- [ ] **Step 1: Full clean build**

Run: `rm -rf dist && npm run build`
Expected: Clean build succeeds

- [ ] **Step 2: Final runtime test**

Run: `npm run test:sounds`
Expected: Sound plays

- [ ] **Step 3: Check git status**

Run: `git status`
Expected: Only untracked or changed files we expect, no dist/

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup and verification

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```
