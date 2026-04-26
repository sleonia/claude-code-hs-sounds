---
description: Add or update a card entry in meta.json from local .wav files
allowed-tools: Bash
---

# /add-audio

Add a new card entry or update an existing one in `meta.json` using `scripts/add-audio.mts`.

## Expected Input

Collect these fields from the user prompt:

- `pack` (required): target key under top-level `packs`
- `title` (required): display card title
- `blizzardUrl` (required): must contain `/ru-ru/`
- `imageUrl` (required): direct Blizzard image URL
- `fsPath` (required): repository-relative card directory path
- `audios` (required): one or more repository-relative `.wav` paths

Example:

```text
/add-audio
pack: Большой турнир
title: Серебряный дозорный
blizzardUrl: https://hearthstone.blizzard.com/ru-ru/cards/2505/
imageUrl: https://d15f34w2p8l1cc.cloudfront.net/hearthstone/02cb33c2a6e6de6d286d966ee595bd9ae9a9c6de273a2ffb94f2be94c0fb4b10.png
fsPath: soundpack/[2015.08.24] Большой турнир/Серебряный дозорный
audios:
- soundpack/[2015.08.24] Большой турнир/Серебряный дозорный/VO_AT_109_PLAY_01.wav
- soundpack/[2015.08.24] Большой турнир/Серебряный дозорный/VO_AT_109_ATTACK_02.wav
```

## Workflow

1. Validate required fields and fail fast if any field is missing.
2. Validate `blizzardUrl` contains `/ru-ru/`.
3. Confirm each `audios` path exists and ends with `.wav`; reject missing paths.
4. Run `node scripts/add-audio.mts` with:
   - `--pack`
   - `--title`
   - `--blizzard-url`
   - `--image-url`
   - `--fs-path`
   - one `--audio` flag per audio file
5. Let the script upsert by `title` or `fsPath`:
   - existing entry: merge audio list and update metadata fields
   - missing entry: create card record in the target pack
6. Return a short summary:
   - action (`created` or `updated`)
   - pack name
   - card title
   - number of audio files now attached

## Command Template

```bash
node scripts/add-audio.mts \
  --pack "<pack>" \
  --title "<title>" \
  --blizzard-url "<ru-ru card url>" \
  --image-url "<image url>" \
  --fs-path "<repo-relative directory>" \
  --audio "<repo-relative wav #1>" \
  --audio "<repo-relative wav #2>"
```

## Constraints

- Keep all paths repository-relative.
- Do not rename files or directories.
- Do not regenerate unrelated files.
- Keep `meta.json` as an object with top-level `packs`.
