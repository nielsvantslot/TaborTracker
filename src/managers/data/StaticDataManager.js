import DataManager from "./DataManager.js";

/**
 * Class representing a Static Data Manager.
 * @extends DataManager
 */
export default class StaticDataManager extends DataManager {
  /**
   * The data held by the StaticDataManager.
   * @type {Object|null}
   * @private
   */
  #data;

  /**
   * Instances of DynamicDataManager.
   * @type {Object}
   * @static
   */
  static #instances = {};

  /**
   * Constructs a StaticDataManager instance.
   * @param {string} fileName - The name of the file.
   */
  constructor(fileName) {
    fileName = ensureSdfExtension(fileName);
    if (StaticDataManager.#instances[fileName]) {
      throw new Error("DONT use this constructor, try getInstance()");
    }
    super(directory, fileName);
    this.#data = null;
    StaticDataManager.#instances[fileName] = this;
  }

  /**
   * Returns an instance of DynamicDataManager if it exists, otherwise creates and returns a new instance.
   * @param {string} fileName - The name of the file.
   * @returns {StaticDataManager} The DynamicDataManager instance.
   */
  static getInstance(fileName) {
    fileName = ensureSdfExtension(fileName);
    return (
      StaticDataManager.#instances[fileName] ??
      (StaticDataManager.#instances[fileName] = new StaticDataManager(fileName))
    );
  }

  /**
   * Retrieves the data from the file.
   * @returns {Object|null} The data from the file, or null if an error occurs.
   */
  async getData() {
    if (!this.#data) {
      console.error("read static data");
      this.#data = await this._readFromFile();
    }
    return this.#data;
  }

  /**
   * Resets the instances of DynamicDataManager.
   * This method is intended for test cleanup purposes.
   */
  static resetInstances() {
    StaticDataManager.#instances = {};
  }
}

// Utility function to ensure the file extension is correct
const ensureSdfExtension = (str) =>
  str.endsWith(extension) ? str : str + extension;

// Constants for file extension and directory
export const extension = ".sdf";
export const directory = "static";
