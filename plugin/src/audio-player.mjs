import { exec } from "child_process";
import util from "util";
const execAsync = util.promisify(exec);

class AudioPlayer {
  static async play(filePath) {
    await execAsync(`afplay "${filePath}"`);
  }
}

export default AudioPlayer;
