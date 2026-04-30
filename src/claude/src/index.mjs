import SoundSelector from "../../shared/src/sound-selector.mjs";
import AudioPlayer from "../../shared/src/audio-player.mjs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.join(__dirname, "..");

const selector = new SoundSelector(repoRoot);

async function handler() {
  const soundPath = selector.getRandomSound();
  if (!soundPath) {
    throw new Error("No sounds available");
  }

  await AudioPlayer.play(soundPath);
}

void handler();
