#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const META_PATH = path.join(ROOT, "meta.json");

function printHelp() {
  console.log(
    `
Usage:
  node scripts/add-audio.mts --pack "Большой турнир" --title "Серебряный дозорный" \\
    --blizzard-url "https://hearthstone.blizzard.com/ru-ru/cards/2505/" \\
    --image-url "https://...png" \\
    --fs-path "soundpack/[2015.08.24] Большой турнир/Серебряный дозорный" \\
    --audio "soundpack/[2015.08.24] Большой турнир/Серебряный дозорный/VO_AT_109_PLAY_01.wav" \\
    --audio "soundpack/[2015.08.24] Большой турнир/Серебряный дозорный/VO_AT_109_ATTACK_02.wav"

Options:
  --pack           Required. Target pack key in meta.json "packs".
  --title          Required. Card title.
  --blizzard-url   Required. ru-ru Blizzard card URL.
  --image-url      Required. Blizzard image URL.
  --fs-path        Required. Repository-relative folder path.
  --audio          Required at least once. Can be repeated.
  --dry-run        Print resulting JSON to stdout without writing file.
  --help           Show this message.
`.trim(),
  );
}

function parseArgs(argv) {
  const args = {
    pack: "",
    title: "",
    blizzardUrl: "",
    imageUrl: "",
    fsPath: "",
    audios: [],
    dryRun: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    const next = argv[i + 1];

    if (key === "--help" || key === "-h") {
      args.help = true;
      continue;
    }
    if (key === "--dry-run") {
      args.dryRun = true;
      continue;
    }
    if (key === "--pack") {
      args.pack = next || "";
      i += 1;
      continue;
    }
    if (key === "--title") {
      args.title = next || "";
      i += 1;
      continue;
    }
    if (key === "--blizzard-url") {
      args.blizzardUrl = next || "";
      i += 1;
      continue;
    }
    if (key === "--image-url") {
      args.imageUrl = next || "";
      i += 1;
      continue;
    }
    if (key === "--fs-path") {
      args.fsPath = next || "";
      i += 1;
      continue;
    }
    if (key === "--audio") {
      if (next) {
        args.audios.push(next);
      }
      i += 1;
      continue;
    }
  }

  return args;
}

function readMeta() {
  if (!fs.existsSync(META_PATH)) {
    throw new Error(`meta.json not found at ${META_PATH}`);
  }

  const raw = fs.readFileSync(META_PATH, "utf8");
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("meta.json must be an object with top-level 'packs'");
  }
  if (
    !parsed.packs ||
    typeof parsed.packs !== "object" ||
    Array.isArray(parsed.packs)
  ) {
    throw new Error("meta.json must contain top-level object field 'packs'");
  }
  return parsed;
}

function unique(values) {
  return [...new Set(values)];
}

function validate(args) {
  const missing = [];
  if (!args.pack) missing.push("--pack");
  if (!args.title) missing.push("--title");
  if (!args.blizzardUrl) missing.push("--blizzard-url");
  if (!args.imageUrl) missing.push("--image-url");
  if (!args.fsPath) missing.push("--fs-path");
  if (!args.audios.length) missing.push("--audio");

  if (missing.length) {
    throw new Error(`Missing required options: ${missing.join(", ")}`);
  }

  if (!args.blizzardUrl.includes("/ru-ru/")) {
    throw new Error("--blizzard-url must use ru-ru locale");
  }
}

function upsert(meta, args) {
  if (!Array.isArray(meta.packs[args.pack])) {
    meta.packs[args.pack] = [];
  }

  const cards = meta.packs[args.pack];
  const idx = cards.findIndex(
    (c) => c.title === args.title || c.fsPath === args.fsPath,
  );
  const base = {
    title: args.title,
    blizzardUrl: args.blizzardUrl,
    imageUrl: args.imageUrl,
    fsPath: args.fsPath,
    audios: unique(args.audios),
  };

  if (idx === -1) {
    cards.push(base);
    return { action: "created", card: base };
  }

  const merged = {
    ...cards[idx],
    ...base,
    audios: unique([...(cards[idx].audios || []), ...args.audios]),
  };
  cards[idx] = merged;
  return { action: "updated", card: merged };
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  validate(args);
  const meta = readMeta();
  const result = upsert(meta, args);
  const output = JSON.stringify(meta, null, 2) + "\n";

  if (args.dryRun) {
    process.stdout.write(output);
  } else {
    fs.writeFileSync(META_PATH, output, "utf8");
    console.log(
      `${result.action}: ${result.card.title} in pack "${args.pack}"`,
    );
  }
}

main();
