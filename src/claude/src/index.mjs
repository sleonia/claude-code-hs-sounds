import SoundSelector from "../../shared/src/sound-selector.mjs";
import AudioPlayer from "../../shared/src/audio-player.mjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.join(__dirname, "..");

const LOG_FILE = "/tmp/hs-sounds.log";

const selector = new SoundSelector(repoRoot);

function logPlayed(soundPath) {
  const relativePath = path.relative(repoRoot, soundPath);
  const timestamp = new Date().toISOString();
  const entry = `${timestamp}  ${relativePath}\n`;
  fs.appendFileSync(LOG_FILE, entry, "utf8");
}

async function handler() {
  const soundPath = selector.getRandomSound();
  if (!soundPath) {
    throw new Error("No sounds available");
  }

  await AudioPlayer.play(soundPath);
  logPlayed(soundPath);
}

void handler();
