# Repository Guidelines

We use JavaScript (type="module") for scripting.

## Project Structure & Module Organization

This repository is a curated Hearthstone sound pack for local notification use. The main content lives under `soundpack/`. Top-level folders group assets by set or category, for example `soundpack/[2015.08.24] Большой турнир/` and `soundpack/Пираты/`. Individual card or character folders contain `.wav` files named after in-game voice or SFX identifiers such as `VO_AT_109_PLAY_01.wav`.

Keep new assets inside the existing set/category structure. Store documentation and generated metadata at the repository root in files like `README.md`, `CLAUDE.md`, and `meta.json`.

## Build, Test, and Development Commands

The repository includes a build system for creating distributable plugins for both Claude Code and OpenCode.

### Build Commands

- `node scripts/build.mjs claude` (or `npm run build:claude`): build the Claude Code plugin distribution to `dist/claude/`.
- `node scripts/build.mjs opencode` (or `npm run build:opencode`): build the OpenCode plugin distribution to `dist/opencode/`.
- `node scripts/build.mjs` (or `npm run build`): build both Claude Code and OpenCode plugins.
- `./install.sh`: build the Claude Code plugin and install it as a local marketplace under `~/.claude/hs-sound-pack/`. After running, register it inside Claude Code with `/plugin marketplace add ~/.claude/hs-sound-pack` then `/plugin install hearthstone-sounds@hs-sound-pack`.
- `npm run format`: format code using Prettier (this one does need `npm install`).

The build only uses Node built-ins, so `npm install` is not required to build.

### Audio Validation

- `find soundpack -type f -iname '*.wav'`: list all tracked audio assets.
- `afinfo path/to/file.wav`: inspect sample rate, channels, and duration on macOS.
- `find soundpack -type f -name '.DS_Store' -delete`: remove Finder metadata before cleanup.
- `find soundpack -depth -mindepth 1 -type d -empty -delete`: remove empty directories after file deletions.

Test changes by opening a few modified files in your audio player and confirming they still play correctly.

## Metadata Format

`meta.json` is a root-level object with a `packs` map used by the static site prototype.

- `packs`: object where each key is a display pack/mode name (for example `Большой турнир`) and each value is an array of card records.
- each card record includes:
- `title`: card title in the display locale, currently Russian where available.
- `blizzardUrl`: `ru-ru` Hearthstone card page URL.
- `imageUrl`: direct Blizzard card image URL.
- `fsPath`: repository-relative folder path for the card or character.
- `audios`: array of repository-relative `.wav` paths for that entry.

When updating `meta.json`, keep paths relative to the repository root and include only entries that have real local audio files.

## Coding Style & Naming Conventions

Prefer preserving the existing directory naming scheme:

- Expansion or category at the first level under `soundpack/`
- Card or character name at the next level
- Original Blizzard-style uppercase file IDs for `.wav` files

Use UTF-8 names where the existing tree already does. Do not rename files just for normalization unless there is a strong compatibility reason.

## Testing Guidelines

Before submitting changes, spot-check audio duration and playback for any files you added or trimmed. If you batch-delete files, re-run `find soundpack -type f -iname '*.wav'` and confirm only the intended assets were removed.

## Commit & Pull Request Guidelines

This workspace snapshot does not include Git history, so no local convention can be inferred. Use short imperative commit subjects such as `remove long voice lines` or `add missing Bob clips`.

Pull requests should include a brief summary of what changed, affected folders, any bulk rename or delete rationale, and notes about macOS-only validation if relevant.

## Claude Code Plugin

The repository includes a Claude Code plugin that provides a custom slash command for playing random sounds as AI agent notifications.

### Source Structure

The plugin source code is organized as follows:

```
src/
├── claude/                       # Claude Code-specific plugin code
│   ├── .claude-plugin/
│   │   └── plugin.json           # Plugin manifest (Claude Code reads this)
│   ├── src/                      # Plugin entry point and Claude-specific logic
│   ├── commands/                 # Command definitions (e.g., play-sound.md)
│   └── hooks/                    # Claude Code hooks
└── shared/                       # Shared code for multiple AI agents
    └── src/
        ├── sound-selector.mjs    # Sound selection logic
        └── audio-player.mjs      # Audio playback utilities
```

### Build Process

The build system creates distributable plugin packages:

1. Run `npm run build` to execute the build script
2. The build script (`scripts/build.mjs`):
   - Copies `src/claude/` → `dist/claude/` (carrying `.claude-plugin/plugin.json`)
   - Copies `src/shared/src/` → `dist/claude/src/shared/`
   - Copies `soundpack/` → `dist/claude/soundpack/`
   - Copies `meta.json` → `dist/claude/meta.json`
   - Rewrites import paths to use correct relative paths (`./shared/`)
3. The resulting `dist/claude/` directory is self-contained and ready to install

### Install Flow

`install.sh` (at the repo root) runs the build, then stages the result as a
local marketplace at `~/.claude/hs-sound-pack/`:

```
~/.claude/hs-sound-pack/
├── .claude-plugin/
│   └── marketplace.json      # generated by install.sh
└── hearthstone-sounds/       # copied from dist/claude/
    ├── .claude-plugin/plugin.json
    ├── commands/, hooks/, src/, soundpack/, meta.json
```

The user then runs `/plugin marketplace add ~/.claude/hs-sound-pack` and
`/plugin install hearthstone-sounds@hs-sound-pack` once inside Claude Code.

### Plugin Architecture (Built Distribution)

- **Location**: `dist/claude/` directory (after build); `~/.claude/hs-sound-pack/hearthstone-sounds/` (after install)
- **Entry point**: `src/index.mjs`
- **Manifest**: `.claude-plugin/plugin.json`
- **Command**: `/hearthstone-sounds:play-sound` - plays a random sound from the pack

### Sound Selection

The plugin reads `meta.json` to build a flat list of all 125+ audio clips. When invoked, it uses a simple random index selection to pick a sound. This ensures all sounds have equal probability of being played.

### Audio Playback

The plugin uses macOS's built-in `afplay` command for audio playback. No external dependencies are required.

### Codex Compatibility

Codex (OpenAI) uses a different plugin architecture focused on web-based APIs and function calling. It does not support:

- Custom slash commands
- Local file system access
- System audio playback

For this reason, the plugin is designed specifically for Claude Code.

## OpenCode Plugin

The repository includes an OpenCode plugin that provides notifications when OpenCode needs your attention.

### Source Structure

OpenCode plugin source lives under `src/opencode/` and is built to `dist/opencode/`:

```
src/opencode/
├── plugins/
│   └── notification.mjs            # Main notification plugin
└── commands/
    └── play-sound.md               # Test command
```

### Build Process

The build system creates a self-contained OpenCode distribution at `dist/opencode/`:

1. Run `npm run build:opencode` to execute the build script
2. The build script (`scripts/build.mjs`):
   - Copies `src/opencode/` → `dist/opencode/plugins/` and `dist/opencode/commands/`
   - Copies `src/shared/src/` → `dist/opencode/src/shared/`
   - Copies `soundpack/` → `dist/opencode/soundpack/`
   - Copies `meta.json` → `dist/opencode/meta.json`
   - Rewrites import paths to use correct relative paths (`./shared/`)
3. The resulting `dist/opencode/` directory is self-contained and ready to install

### Install Flow

For OpenCode, copy the built distribution to the plugin directory:

**Project-level (per-project use):**

```bash
cp -R dist/opencode/.opencode /path/to/your/project/.opencode
```

**Global (all projects):**

```bash
cp -R dist/opencode/.opencode ~/.config/opencode/
cp -R dist/opencode/.opencode/commands ~/.config/opencode/
```

OpenCode automatically loads plugins from these directories at startup.

### Plugin Architecture (Built Distribution)

- **Location**: `dist/opencode/` directory after build
- **Plugin file**: `dist/opencode/plugins/notification.mjs`
- **Command file**: `dist/opencode/commands/play-sound.md`
- **Events handled**:
  - `session.idle` — agent finished responding (equivalent to Claude Code's TaskCompleted)
  - `permission.asked` — agent is requesting permission (equivalent to Claude Code's PermissionRequest)
  - `session.error` — agent encountered an error
- **Code reuse**: Uses the same `SoundSelector` and `AudioPlayer` classes from `src/shared/src/` via correct relative paths after build
- **Test command**: `/play-sound` — plays a random sound to verify the soundpack works

### Sound Selection & Audio Playback

Uses the same `SoundSelector` and `AudioPlayer` classes as the Claude Code plugin:

- Reads `meta.json` to build a flat list of all 125+ audio clips
- Uses simple random index selection to pick a sound
- Uses macOS's built-in `afplay` command for audio playback
- No external dependencies required
