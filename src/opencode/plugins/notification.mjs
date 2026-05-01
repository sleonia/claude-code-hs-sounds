import { fileURLToPath } from "url";
import path from "path";
import SoundSelector from "../../src/shared/src/sound-selector.mjs";
import AudioPlayer from "../../src/shared/src/audio-player.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../../..");

export const HearthstoneNotificationPlugin = async ({ $ }) => {
  const selector = new SoundSelector(repoRoot);

  const playSound = async () => {
    try {
      const soundPath = selector.getRandomSound();
      if (soundPath) await AudioPlayer.play(soundPath);
    } catch {}
  };

  return {
    event: async ({ event }) => {
      if (
        event.type === "session.idle" ||
        event.type === "permission.asked" ||
        event.type === "session.error"
      ) {
        await playSound();
      }
    },
  };
};
