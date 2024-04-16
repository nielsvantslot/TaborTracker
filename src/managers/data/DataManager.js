import { promises as fs } from "fs";
import path from "path";
import { __dirname } from "../../utils.js";

/**
 * Class representing a Data Manager.
 */
export default class DataManager {
  /**
   * The file path where the data is stored.
   * @type {string}
   * @protected
   */
  _filePath;

  /**
   * The directory where the data file is located.
   * @type {string}
   * @private
   */
  #directory;

  /**
   * A promise for file initialization.
   * @type {Promise<void>}
   * @private
   */
  #filePromise;

  /**
   * Lock object to ensure synchronized file initialization.
   * @type {Object}
   * @static
   */
  static #fileLock = {};

  /**
   * Instances of DynamicDataManager.
   * @type {Object}
   * @static
   */
  static #instances = {};

  /**
   * Constructs a DataManager instance.
   * @param {string} subDirectory - The subdirectory name where the file is located.
   * @param {string} fileName - The name of the file.
   */
  constructor(subDirectory, fileName) {
    this.#directory = path.resolve(__dirname, "data", subDirectory);
    this._filePath = path.resolve(this.#directory, fileName);
  }

  /**
   * Returns an instance of the subclass if it exists, otherwise creates and returns a new instance.
   * @param {string} subclassName - The name of the subclass.
   * @param {string} fileName - The name of the file.
   * @returns {DataManager} The DataManager instance.
   */
  static getInstance(subDirectory, fileName) {
    const directory = path.resolve(__dirname, "data", subDirectory);
    const filePath = path.resolve(directory, fileName);
    if (!DataManager.#instances[filePath]) {
      DataManager.#instances[filePath] = new DataManager(
        subDirectory,
        fileName,
      );
    }
    return DataManager.#instances[filePath];
  }

  /**
   * Initializes the file by creating it if it doesn't exist.
   * @private
   */
  async #initializeFile() {
    // Check if the file is already being initialized
    if (!DataManager.#fileLock[this._filePath]) {
      // Create a lock for this file
      DataManager.#fileLock[this._filePath] = true;
      try {
        await fs.access(this._filePath);
      } catch (error) {
        console.log("making file");
        await fs.mkdir(this.#directory, { recursive: true });
        await fs.writeFile(this._filePath, JSON.stringify({}));
      } finally {
        // Release the lock
        delete DataManager.#fileLock[this._filePath];
      }
    } else {
      // If another instance is already creating the file, wait for it to finish
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          if (!DataManager.#fileLock[this._filePath]) {
            clearInterval(interval);
            resolve();
          }
        }, 10);
      });
    }
  }

  /**
   * Reads data from the file.
   * @returns {Object|null} - The data read from the file, or null if an error occurs.
   * @protected
   */
  async _readFromFile() {
    await this._ensureSource();
    try {
      const rawData = await fs.readFile(this._filePath, "utf-8");
      return JSON.parse(rawData);
    } catch (error) {
      console.error("Error reading from file:", error);
      return null;
    }
  }

  /**
   * Waits for the initialization of the data.
   * @returns {Promise<void>} A promise that resolves when the generator data is initialized.
   * @protected
   */
  async _ensureSource() {
    if (!this.#filePromise) {
      this.#filePromise = this.#initializeFile();
    }
    await this.#filePromise;
  }

  /**
   * Resets the instances of DynamicDataManager.
   * This method is intended for test cleanup purposes.
   */
  static resetInstances() {
    DataManager.#instances = {};
  }

  static getInstances() {
    return DataManager.#instances;
  }
}
