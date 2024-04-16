import DataManager from "./DataManager.js";
import { promises as fs } from "fs";

/**
 * Class representing a Dynamic Data Manager.
 * @extends DataManager
 */
export default class DynamicDataManager extends DataManager {
  /**
   * Indicates if the data manager is locked.
   * @type {boolean}
   * @private
   */
  #locked = false;

  /**
   * Instances of DynamicDataManager.
   * @type {Object}
   * @static
   */
  static #instances = {};

  /**
   * Constructs a DynamicDataManager instance.
   * @param {string} fileName - The name of the file.
   */
  constructor(fileName) {
    fileName = ensureDdfExtension(fileName);
    if (DynamicDataManager.#instances[fileName]) {
      throw new Error("DONT use this constructor, try getInstance()");
    }
    super(directory, fileName);
    DynamicDataManager.#instances[fileName] = this;
  }

  /**
   * Returns an instance of DynamicDataManager if it exists, otherwise creates and returns a new instance.
   * @param {string} fileName - The name of the file.
   * @returns {DynamicDataManager} The DynamicDataManager instance.
   */
  static getInstance(fileName) {
    fileName = ensureDdfExtension(fileName);
    return (
      DynamicDataManager.#instances[fileName] ??
      (DynamicDataManager.#instances[fileName] = new DynamicDataManager(
        fileName,
      ))
    );
  }

  /**
   * Creates a new record in the data.
   * @param {string} key - The key of the new record.
   * @param {Object} value - The value of the new record.
   * @returns {Promise<void>} A promise that resolves when the record is created successfully.
   */
  async createRecord(key, value) {
    await this.#waitForUnlock();
    try {
      this.#lock();
      const data = await this._readFromFile();
      data[key] = value;
      await this.#writeToFile(data);
    } finally {
      this.#unlock();
    }
  }

  /**
   * Reads a record from the data.
   * @param {string} key - The key of the record to read.
   * @returns {Promise<Object|null>} A promise that resolves with the record value if found, or null if not found.
   */
  async readRecord(key) {
    const data = await this._readFromFile();
    return data[key] || null;
  }

  /**
   * Reads all records from the data.
   * @returns {Promise<Object>} A promise that resolves with all records.
   */
  async readAllRecords() {
    return this._readFromFile();
  }

  /**
   * Updates a record in the data.
   * @param {string} key - The key of the record to update.
   * @param {Object} value - The new value of the record.
   * @returns {Promise<void>} A promise that resolves when the record is updated successfully.
   */
  async updateRecord(key, value) {
    await this.#waitForUnlock();
    try {
      this.#lock();
      const data = await this._readFromFile();
      if (data[key]) {
        data[key] = value;
        await this.#writeToFile(data);
      } else {
        throw new Error(`Record with key ${key} not found.`);
      }
    } finally {
      this.#unlock();
    }
  }

  /**
   * Deletes a record from the data.
   * @param {string} key - The key of the record to delete.
   * @returns {Promise<void>} A promise that resolves when the record is deleted successfully.
   */
  async deleteRecord(key) {
    await this.#waitForUnlock();
    try {
      this.#lock();
      const data = await this._readFromFile();
      if (data[key]) {
        delete data[key];
        await this.#writeToFile(data);
      } else {
        throw new Error(`Record with key ${key} not found.`);
      }
    } finally {
      this.#unlock();
    }
  }

  /**
   * Writes data to the file.
   * @param {Object} data - The data to be written.
   * @private
   */
  async #writeToFile(data) {
    await this._ensureSource();
    await fs.writeFile(this._filePath, JSON.stringify(data));
    console.log("Data saved successfully.");
  }

  /**
   * Waits until the file is unlocked.
   * @private
   */
  async #waitForUnlock() {
    while (this.#locked) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  /**
   * Locks the data manager.
   * @private
   */
  #lock() {
    this.#locked = true;
  }

  /**
   * Unlocks the data manager.
   * @private
   */
  #unlock() {
    this.#locked = false;
  }

  /**
   * Resets the instances of DynamicDataManager.
   * This method is intended for test cleanup purposes.
   */
  static resetInstances() {
    DynamicDataManager.#instances = {};
  }

  static getInstances() {
    return DynamicDataManager.#instances;
  }
}

export const extension = ".ddf";
export const directory = "dynamic";
const ensureDdfExtension = (str) =>
  str.endsWith(extension) ? str : str + extension;
