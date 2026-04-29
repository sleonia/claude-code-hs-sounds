# Repository Restructuring Design

**Date:** 2026-04-30
**Author:** sleonia
**Status:** Approved

## Overview

Restructure the repository to separate source code from distribution, enabling clean support for multiple agent plugins (Claude Code, and future Codex, OpenCode, etc.) while avoiding code duplication.

## Directory Structure

```
/                                    <-- Repository root
├── src/                              # Source code
│   ├── shared/                         # Shared JS modules
│   │   └── src/
│   │       ├── sound-selector.mjs         # Reads meta.json, selects random sound
│   │       └── audio-player.mjs          # macOS afplay wrapper
│   └── claude/                        # Claude Code plugin source
│       ├── manifest.json                 # Plugin manifest (version: "1.0.0")
│       ├── commands/
│       │   └── hs-sounds_test-sounds.md
│       ├── hooks/
│       └── src/
│           └── index.mjs                # Entry point, imports from ../shared/
├── soundpack/                         # Audio files
├── meta.json                          # Sound metadata
├── site/                              # Documentation site
├── package.json                        # Repo metadata
├── scripts/
│   └── build.mjs                      # Build script
└── dist/                              # Generated plugins
    └── claude/                         # Self-contained Claude plugin
        ├── manifest.json
        ├── commands/
        ├── hooks/
        └── src/
            ├── index.mjs
            └── shared/
                ├── sound-selector.mjs
                └── audio-player.mjs
```

## Components & Architecture

### Shared Code

| Module               | Purpose                                                              | Dependencies                 |
| -------------------- | -------------------------------------------------------------------- | ---------------------------- |
| `sound-selector.mjs` | Loads `meta.json`, flattens audio paths, provides `getRandomSound()` | Node `fs`, `path`            |
| `audio-player.mjs`   | Wraps macOS `afplay` command for async playback                      | Node `child_process`, `util` |

### Claude Plugin

| Component       | Purpose                                                    |
| --------------- | ---------------------------------------------------------- |
| `manifest.json` | Claude Code plugin definition (name, version, commands)    |
| `commands/`     | Slash command definitions                                  |
| `hooks/`        | Event hooks                                                |
| `src/index.mjs` | Command handler that orchestrates: selector → audio player |

### Data Flow

```
User runs /hs-sounds:test-sounds
         ↓
Claude Code executes src/claude/src/index.mjs
         ↓
SoundSelector.getRandomSound()
         ↓
Reads meta.json
         ↓
Flattens all audio paths into array
         ↓
Selects random index
         ↓
Returns absolute path to .wav file
         ↓
AudioPlayer.play(filePath)
         ↓
Executes: afplay "/path/to/sound.wav"
         ↓
Sound plays through macOS audio
```

## Build Process

### What `scripts/build.mjs` does

1. Create `dist/claude/` directory
2. Copy `src/claude/` → `dist/claude/`
3. Copy `src/shared/src/` → `dist/claude/src/shared/`
4. Copy `soundpack/` → `dist/claude/soundpack/`
5. Copy `meta.json` → `dist/claude/meta.json`
6. Exclude `site/` from distribution

### package.json scripts

```json
{
  "scripts": {
    "build": "node scripts/build.mjs",
    "build:claude": "node scripts/build.mjs claude"
  }
}
```

## Versioning

- **Root `package.json`** - Overall repo version (for tracking)
- **`src/claude/manifest.json`** - Claude plugin version (independent)
- Future agents will have their own manifest versions

Each agent can evolve independently.

## Error Handling

### Proposed Additions

**In `sound-selector.mjs`:**

```javascript
constructor(basePath) {
  this.basePath = basePath;
  const metaPath = path.join(this.basePath, "meta.json");

  // Validate meta.json exists and is valid
  if (!fs.existsSync(metaPath)) {
    throw new Error(`meta.json not found at ${metaPath}`);
  }

  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    this.sounds = this.loadSounds(meta);
  } catch (e) {
    throw new Error(`Invalid meta.json: ${e.message}`);
  }

  if (this.sounds.length === 0) {
    throw new Error("No sounds available in meta.json");
  }
}
```

**In `audio-player.mjs`:**

```javascript
static async play(filePath) {
  // Validate file exists before calling afplay
  if (!fs.existsSync(filePath)) {
    throw new Error(`Audio file not found: ${filePath}`);
  }
  await execAsync(`afplay "${filePath}"`);
}
```

## Migration Steps

### Step 1: Create new directory structure

```bash
mkdir -p src/shared/src
mkdir -p src/claude/{commands,hooks,src}
mkdir -p scripts
```

### Step 2: Move existing files

```bash
# Move shared modules
mv plugin/src/sound-selector.mjs src/shared/src/
mv plugin/src/audio-player.mjs src/shared/src/

# Move Claude plugin
mv plugin/manifest.json src/claude/
mv plugin/commands src/claude/
mv plugin/hooks src/claude/
mv plugin/src/index.mjs src/claude/src/

# Clean up old structure
rmdir plugin/src
rmdir plugin
```

### Step 3: Update imports

- Edit `src/claude/src/index.mjs`
- Change imports to: `from "../../../shared/src/sound-selector.mjs"`
- After build, `dist/claude/src/index.mjs` will import from: `from "./shared/sound-selector.mjs"`

### Step 4: Create build script

- Write `scripts/build.mjs` that copies files to `dist/claude/`
- Update `package.json` with build script

### Step 5: Test build

```bash
npm run build
ls -R dist/claude/
```

### Step 6: Update documentation

- Update `README.md` with new install instructions
- Update `AGENTS.md` if it references plugin paths

## Validation Checklist

- [ ] Build script creates `dist/claude/` with all required files
- [ ] `dist/claude/src/index.mjs` imports work correctly
- [ ] Plugin command `/hs-sounds:test-sounds` works from `dist/claude/`
- [ ] `site/` is NOT included in `dist/`
- [ ] Documentation updated to reflect new structure
- [ ] Old `plugin/` directory removed

## Rollback Plan

If anything goes wrong:

```bash
# You still have git history
git checkout -- plugin/

# Or if you committed the changes:
git revert <commit-hash>
```

## Future Extensions

### Adding New Agents

To add support for a new agent (e.g., Codex):

1. Create `src/codex/` directory with agent-specific files
2. Create `src/codex/manifest.json` with its own version
3. Create agent-specific entry point that imports from `../shared/src/`
4. Update build script to also build `dist/codex/`
5. Test and publish

### Cross-Platform Support

Not implementing now, but for future cross-platform support:

```javascript
const platform = process.platform;
const player =
  platform === "darwin" ? "afplay" : platform === "linux" ? "aplay" : null;
```
