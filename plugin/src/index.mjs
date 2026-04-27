import SoundSelector from "./sound-selector.mjs";
import AudioPlayer from "./audio-player.mjs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.join(__dirname, "../..");

const selector = new SoundSelector(repoRoot);

export default async function handler(args) {
  const soundPath = selector.getRandomSound();
  if (!soundPath) {
    throw new Error("No sounds available");
  }

  await AudioPlayer.play(soundPath);
}
