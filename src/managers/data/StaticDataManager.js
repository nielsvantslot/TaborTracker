import DataManager from './DataManager.js';
import path from 'path';

export default class StaticDataManager extends DataManager {
  /**
   * Constructs a StaticDataManager instance.
   * @param {string} directoryPath - The directory path where the file is located.
   * @param {string} fileName - The name of the file.
   */
  constructor(fileName) {
    super('static', fileName);
  }

  /**
   * Retrieves data from the file.
   * @returns {Object|null} - The data read from the file, or null if an error occurs.
   */
  async getData() {
    return this.readFromFile();
  }
}
