# Hearthstone sounds

The main idea: in my childhood I used to be a huge Hearthstone player. Up to the today's day I remember sounds and themes from the game. I use AI agents a lot, sometimes even several ones in parallel, so I need to get notifications about their progress. For this purpose I created a soundpack with memorable sounds from the golden era of Hearthstone. When AI needs you - you will be notified by familiar sound!

Tested only on MacOS other platforms are not tested, but PRs are welcome.

## Sources

- [Great Hearthstone Sound Pack](https://eu.forums.blizzard.com/ru/hearthstone/t/%D1%84%D0%B0%D0%B9%D0%BB%D1%8B-%D0%B7%D0%B2%D1%83%D0%BA%D0%BE%D0%B2-%D0%BA%D0%B0%D1%80%D1%82-%D0%B8%D0%B7-hearthstone/39)
- [Hearthstone JSON scripts pack](https://github.com/Zero-to-Heroes/HearthstoneJSON/tree/master)
- [Oficial site with cards](https://hearthstone.blizzard.com/ru-ru/cards)
- [All of Hearthstone's card sounds](https://www.reddit.com/r/hearthstone/comments/iaw2sz/hearthsfx_an_uptodate_site_for_nearly_all_of)
- [Google Drive with the audios](https://drive.google.com/drive/folders/1jwjkNVFcfyBiWZ8Yx_Bp5FuNWqlUz1W3)

I also took inspiration from this repo: https://github.com/newink/claudecode-sounds/tree/main

## Install

### Claude Code

Clone the repository and run the install script. It builds a self-contained
plugin and stages it under `~/.claude/ai-harness-hs-sounds/` as a local marketplace.

```bash
git clone https://github.com/sleonia/ai-harness-hs-sounds.git /tmp/ai-harness-hs-sounds
cd /tmp/ai-harness-hs-sounds
./install.sh # and proceed the steps
```

You can test it both ways:
```
# 1. Run claude code and run the testing command and hear the sound
claude
/play-sound

# 2. Or you call bash ` claude -p "ask me smth"` and hear the sound
```

**Usage:** run `/hearthstone-sounds:play-sound` to play a random sound.

**Platform:** macOS only — playback uses the built-in `afplay` command.

After cloning, the source repo is no longer needed at runtime — the install
script copies everything the plugin needs into `~/.claude/ai-harness-hs-sounds/`.

## Uninstall

```
claude plugin uninstall hearthstone-sounds@ai-harness-hs-sounds
```

Then remove the staged copy: `rm -rf ~/.claude/ai-harness-hs-sounds`.

## Development

### Building locally

The build requires no external dependencies — only Node.js built-ins are used.

```bash
node scripts/build.mjs claude   # or: npm run build:claude
```

This produces a self-contained distribution at `dist/claude/`. To build **and**
install in one step:

```bash
./install.sh
```

Then reload the plugin inside Claude Code:

```
/reload-plugins
```

### Troubleshooting bad sounds

Every time a sound is played, its path and full hook context are appended as a
JSON line to `/tmp/hs-sounds.log`. If a sound is unpleasant, distorted, or just
not to your taste, you can remove it permanently:

1. **Find the offending sound** — open the log and look at the last entry:

   ```bash
   tail -1 /tmp/hs-sounds.log | jq .
   ```

   The output looks like:

   ```json
   {
     "session_id": "7de06943-8d37-4c70-b53d-af2604c6d860",
     "transcript_path": "/Users/sleonia/.claude/projects/-private-tmp-.../7de06943.jsonl",
     "cwd": "/private/tmp/ai-harness-hs-sounds",
     "permission_mode": "default",
     "hook_event_name": "Stop",
     "stop_hook_active": false,
     "last_assistant_message": "Tell me want what you really really want",
     "sound": "soundpack/Пираты/Капитан Гребешок/VO_AT_109_PLAY_01.wav"
   }
   ```

   To extract just the sound path:

   ```bash
   tail -1 /tmp/hs-sounds.log | jq -r '.sound'
   ```

2. **Delete the `.wav` file** from the source repository using the path from
   the log:

   ```bash
   rm "soundpack/Пираты/Капитан Гребешок/VO_AT_109_PLAY_01.wav"
   ```

3. **Remove its entry from `meta.json`** so it no longer appears in the random
   pool. Open `meta.json`, find the matching path inside an `audios` array, and
   delete that string. If it was the only audio for a card, remove the entire
   card object from the pack array.

4. **Rebuild and reinstall**:

   ```bash
   ./install.sh
   ```

   Then reload inside Claude Code:

   ```
   /reload-plugins
   ```

## Disclaimer

All rights to Hearthstone assets, audio, names, and trademarks are reserved by Blizzard Entertainment.
