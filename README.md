# Hearthstone

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

### Claude Code (via Marketplace)

This sound pack is available as a Claude Code plugin on the marketplace. Install it directly from Claude Code:

1. Run `/plugin marketplace add https://github.com/sleonia/hs-sound-pack --scope user`
2. Run `/reload-plugins` to load the plugin

**Usage:** Run `/hearthstone-sounds:play-sound` to play a random sound from the collection.

**Platform:** macOS only—uses the built-in `afplay` command.

### Claude Code (Manual)

Install from source if you prefer manual setup:

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the plugin distribution
4. Open Claude Code settings and add the built plugin path: `/path/to/repo/dist/claude`

### Codex (OpenAI)

Codex does not support local audio playback plugins. The sound files can be used manually with your preferred audio player, or consider using Claude Code for integrated sound notifications.
