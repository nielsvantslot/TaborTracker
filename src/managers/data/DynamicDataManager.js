import { promises as fs } from "fs";
import Mutex from "../../structs/Mutex.js";
import DataManager from "./DataManager.js";

/**
 * Class representing a Dynamic Data Manager.
 * @extends DataManager
 */
export default class DynamicDataManager extends DataManager {
  /**
   * Instances of DynamicDataManager.
   * @type {Object}
   * @static
   */
  static #instances = {};

  #filteredData;

  #mutex;

  static operators = {
    "==": (a, b) => a === b,
    "!=": (a, b) => a !== b,
    ">": (a, b) => a > b,
    "<": (a, b) => a < b,
    ">=": (a, b) => a >= b,
    "<=": (a, b) => a <= b,
  };

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
    this.#mutex = new Mutex();
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
    await this.#mutex.acquire();
    try {
      const data = await this._readFromFile();
      data[key] = value;
      await this.#writeToFile(data);
    } finally {
      this.#mutex.release();
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

  async getWhere(property, operator, value) {
    this.#filteredData = await this.readAllRecords();
    this.#filteredData = Object.values(this.#filteredData).filter((item) =>
      DynamicDataManager.operators[operator](item[property], value),
    );

    return this;
  }

  where(property, operator, value) {
    this.#filteredData = Object.values(this.#filteredData).filter((item) =>
      DynamicDataManager.operators[operator](item[property], value),
    );
    return this; // Return the instance for chaining
  }

  getResult() {
    return this.#filteredData;
  }

  /**
   * Reads all records from the data.
   * @returns {Promise<Object>} A promise that resolves with all records.
   */
  async readAllRecords() {
    return await this._readFromFile();
  }

  /**
   * Updates a record in the data.
   * @param {string} key - The key of the record to update.
   * @param {Object} value - The new value of the record.
   * @returns {Promise<void>} A promise that resolves when the record is updated successfully.
   */
  async updateRecord(key, value) {
    await this.#mutex.acquire();
    try {
      const data = await this._readFromFile();
      if (data[key]) {
        data[key] = value;
        await this.#writeToFile(data);
      } else {
        throw new Error(`Record with key ${key} not found.`);
      }
    } finally {
      this.#mutex.release();
    }
  }

  /**
   * Deletes a record from the data.
   * @param {string} key - The key of the record to delete.
   * @returns {Promise<void>} A promise that resolves when the record is deleted successfully.
   */
  async deleteRecord(key) {
    await this.#mutex.acquire();
    try {
      const data = await this._readFromFile();
      if (data[key]) {
        delete data[key];
        await this.#writeToFile(data);
      } else {
        throw new Error(`Record with key ${key} not found.`);
      }
    } finally {
      this.#mutex.release();
    }
  }

  async replaceData(json) {
    await this.#writeToFile(json);
    console.log("Data replaced!!");
  }

  /**
   * Writes data to the file.
   * @param {Object} data - The data to be written.
   * @private
   */
  async #writeToFile(data) {
    await this._ensureSource();
    await fs.writeFile(this._filePath, JSON.stringify(data));
    console.log(this._filePath, "Data saved successfully.");
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
