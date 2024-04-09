import { promises as fs } from "fs";
import { __dirname } from "../../utils.js";
import path from "path";

export default class DataManager {
  /**
   * Constructs a DataManager instance.
   * @param {string} directoryPath - The directory path where the file is located.
   * @param {string} fileName - The name of the file.
   */
  constructor(directoryPath, fileName) {
    this.filePath = path.resolve(__dirname, "data", directoryPath, fileName);
    this.locked = false;
    this.initializeFile();
  }

  /**
   * Initializes the file by creating it if it doesn't exist.
   */
  async initializeFile() {
    try {
      await fs.access(this.filePath);
    } catch (error) {
      await fs.writeFile(this.filePath, JSON.stringify({}));
    }
  }

  /**
   * Reads data from the file.
   * @returns {Object|null} - The data read from the file, or null if an error occurs.
   */
  async readFromFile() {
    try {
      const rawData = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(rawData);
    } catch (error) {
      console.error("Error reading from file:", error);
      return null;
    }
  }

  /**
   * Waits until the file is unlocked.
   */
  async waitForUnlock() {
    while (this.locked) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}
