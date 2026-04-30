# Hearthstone sounds

The main idea: in my childhood I used to be a huge Hearthstone player. Up to the today's day I remember sounds and themes from the game. I use AI agents a lot, sometimes even several ones in parallel, so I need to get notifications about their progress. For this purpose I created a soundpack with memorable sounds from the golden era of Hearthstone. When AI needs you - you will be notified by familiar sound!

Tested only on MacOS other platforms are not tested, but PRs are welcome.

## Sources

- [Great Hearthstone Sound Pack](https://eu.forums.blizzard.com/ru/hearthstone/t/%D1%84%D0%B0%D0%B9%D0%BB%D1%8B-%D0%B7%D0%B2%D1%83%D0%BA%D0%BE%D0%B2-%D0%BA%D0%B0%D1%80%D1%82-%D0%B8%D0%B7-hearthstone/39)
- [Hearthstone JSON scripts pack](https://github.com/Zero-to-Heroes/HearthstoneJSON/tree/master)
- [Oficial site with cards](https://hearthstone.blizzard.com/ru-ru/cards)
- https://www.reddit.com/r/hearthstone/comments/iaw2sz/hearthsfx_an_uptodate_site_for_nearly_all_of/
- https://drive.google.com/drive/folders/1jwjkNVFcfyBiWZ8Yx_Bp5FuNWqlUz1W3

I also took inspiration from this repo: https://github.com/newink/claudecode-sounds/tree/main

## Install

### Claude Code

Clone the repository and run the install script. It builds a self-contained
plugin and stages it under `~/.claude/hs-sound-pack/` as a local marketplace.

```bash
git clone https://github.com/sleonia/claude-code-hs-sounds.git
cd claude-code-hs-sounds
./install.sh
```

Then, inside Claude Code, register the marketplace and install the plugin
(one-time):

```
claude marketplace add ~/.claude/hs-sound-pack
claude install hearthstone-sounds@hs-sound-pack

# You can test it both ways:
# 1. Run claude code and run the testing command and hear the sound
claude
/play-sound

# 2. Or you call bash ` claude -p "ask me smth"` and hear the sound
```

**Usage:** run `/hearthstone-sounds:play-sound` to play a random sound.

**Platform:** macOS only — playback uses the built-in `afplay` command.

After cloning, the source repo is no longer needed at runtime — the install
script copies everything the plugin needs into `~/.claude/hs-sound-pack/`.

### Codex (OpenAI)

Codex does not support local audio playback plugins. The sound files can be
used manually with your preferred audio player, or consider using Claude Code
for integrated sound notifications.

## Uninstall

```
/plugin uninstall hearthstone-sounds@hs-sound-pack
/plugin marketplace remove hs-sound-pack
```

Then remove the staged copy: `rm -rf ~/.claude/hs-sound-pack`.
