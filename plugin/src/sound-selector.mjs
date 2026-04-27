import fs from "fs";
import path from "path";

class SoundSelector {
  constructor(basePath) {
    this.basePath = basePath;
    this.sounds = this.loadSounds();
  }

  loadSounds() {
    const metaPath = path.join(this.basePath, "meta.json");
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));

    const allSounds = [];
    for (const pack of Object.values(meta.packs)) {
      for (const card of pack) {
        allSounds.push(...card.audios);
      }
    }
    return allSounds;
  }

  getRandomSound() {
    if (this.sounds.length === 0) return null;
    const index = Math.floor(Math.random() * this.sounds.length);
    return path.join(this.basePath, this.sounds[index]);
  }
}

export default SoundSelector;
