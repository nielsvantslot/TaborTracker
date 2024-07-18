import { promises as fs } from "fs";
import path from "path";
import { __dirname } from "../../utils.js";
import Mutex from "../../structs/Mutex";

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
   * Mutex for synchronized file initialization.
   * @type {Mutex}
   * @private
   */
  #mutex;

  /**
   * Instances of DataManager.
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
    this.#mutex = new Mutex();
  }

  /**
   * Returns an instance of the DataManager if it exists, otherwise creates and returns a new instance.
   * @param {string} subDirectory - The subdirectory name.
   * @param {string} fileName - The name of the file.
   * @returns {DataManager} The DataManager instance.
   */
  static getInstance(subDirectory, fileName) {
    const directory = path.resolve(__dirname, "data", subDirectory);
    const filePath = path.resolve(directory, fileName);
    if (!DataManager.#instances[filePath]) {
      DataManager.#instances[filePath] = new DataManager(subDirectory, fileName);
    }
    return DataManager.#instances[filePath];
  }

  /**
   * Initializes the file by creating it if it doesn't exist.
   * @private
   */
  async #initializeFile() {
    await this.#mutex.acquire();
    try {
      await fs.access(this._filePath);
    } catch (error) {
      try {
        console.log(`Creating file ${this._filePath}`);
        await fs.mkdir(this.#directory, { recursive: true });
        await fs.writeFile(this._filePath, JSON.stringify({}));
      } catch (mkdirError) {
        console.error("Error creating file:", mkdirError);
      }
    } finally {
      this.#mutex.release();
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
   * Ensures the file is initialized before performing operations.
   * @returns {Promise<void>} A promise that resolves when the file is initialized.
   * @protected
   */
  async _ensureSource() {
    if (!this.#filePromise) {
      this.#filePromise = this.#initializeFile();
    }
    await this.#filePromise;
  }

  /**
   * Resets the instances of DataManager.
   * This method is intended for test cleanup purposes.
   */
  static resetInstances() {
    DataManager.#instances = {};
  }

  /**
   * Gets all instances of DataManager.
   * @returns {Object} The instances of DataManager.
   */
  static getInstances() {
    return DataManager.#instances;
  }
}
