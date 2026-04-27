# Hearthstone

The main idea: in my childhood I used to be a huge Hearthstone player. Up to the today's day I remember sounds and themes from the game. I use AI agents a lot, sometimes even several ones in parallel, so I need to get notifications about their progress. For this purpose I created a soundpack with memorable sounds from the golden era of Hearthstone. When AI needs you - you will be notified by familiar sound!

Tested only on MacOS other platforms are not tested, but PRs are welcome.

## Sources

- [Great Hearthstone Sound Pack](https://eu.forums.blizzard.com/ru/hearthstone/t/%D1%84%D0%B0%D0%B9%D0%BB%D1%8B-%D0%B7%D0%B2%D1%83%D0%BA%D0%BE%D0%B2-%D0%BA%D0%B0%D1%80%D1%82-%D0%B8%D0%B7-hearthstone/39)
- [Hearthstone JSON scripts pack](https://github.com/Zero-to-Heroes/HearthstoneJSON/tree/master)
- [Oficial site with cards](https://hearthstone.blizzard.com/ru-ru/cards)

I also took inspiration from this repo: https://github.com/newink/claudecode-sounds/tree/main

## Install

### Claude Code

This sound pack is available as a Claude Code plugin. Install it to get AI agent notifications from Hearthstone's golden era.

1. Open Claude Code
2. Navigate to the Plugin Marketplace
3. Search for "Hearthstone Sound Pack"
4. Click Install

**Usage:** Run `/hs-sounds:test-sounds` to play a random sound from the collection.

**Platform:** macOS only—uses the built-in `afplay` command.

### Codex (OpenAI)

Codex does not support local audio playback plugins. The sound files can be used manually with your preferred audio player, or consider using Claude Code for integrated sound notifications.
