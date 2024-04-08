import { promises as fs } from 'fs';
import DataManager from './DataManager.js';
import path from 'path';

export default class DynamicDataManager extends DataManager {
  /**
   * Constructs a DynamicDataManager instance.
   * @param {string} fileName - The name of the file.
   */
  constructor(fileName) {
    super('dynamic', fileName);
  }

  /**
   * Saves data to the file.
   * @param {Object} data - The data to be saved.
   */
  async saveData(data) {
    if (this.locked) {
      await this.waitForUnlock();
    }

    try {
      this.locked = true;
      await this.writeToFile(data);
      console.log('Data saved successfully.');
    } finally {
      this.locked = false;
    }
  }

  /**
   * Writes data to the file.
   * @param {Object} data - The data to be written.
   */
  async writeToFile(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data));
  }
}
