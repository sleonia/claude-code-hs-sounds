import SoundSelector from "./shared/sound-selector.mjs";
import AudioPlayer from "./shared/audio-player.mjs";
import path from "path";

const repoRoot = process.cwd();

const selector = new SoundSelector(repoRoot);

const soundPath = selector.getRandomSound();
if (!soundPath) {
  throw new Error("No sounds available");
}

await AudioPlayer.play(soundPath);

console.log(`Played: ${path.relative(repoRoot, soundPath)}`);
