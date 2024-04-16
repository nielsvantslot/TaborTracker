import DataManager from "./DataManager.js";

/**
 * Class representing a Static Data Manager.
 * @extends DataManager
 */
export default class StaticDataManager extends DataManager {
  /**
   * A promise for data initialization.
   * @type {Promise<void>}
   * @private
   */
  #dataPromise;

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
    this.#dataPromise;
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
   * Retrieves data from the file.
   * @returns {Object|null} - The data read from the file, or null if an error occurs.
   */
  async getData() {
    await this._ensureData();
    return this.#data;
  }

  /**
   * Loads the data asynchronously.
   * @returns {Promise<void>} A promise that resolves when the data is loaded.
   */
  async #loadData() {
    try {
      this.#data = await this._readFromFile();
    } catch (error) {
      console.error("Error loading data:", error);
      this.#data = null;
    }
  }

  /**
   * Waits for the initialization of data.
   * @returns {Promise<void>} A promise that resolves when the data is initialized.
   */
  async _ensureData() {
    this.#dataPromise = await this.#loadData();
  }

  /**
   * Resets the instances of DynamicDataManager.
   * This method is intended for test cleanup purposes.
   */
  static resetInstances() {
    StaticDataManager.#instances = {};
  }

  static getInstances() {
    return StaticDataManager.#instances;
  }
}

export const extension = ".sdf";
export const directory = "static";
const ensureSdfExtension = (str) =>
  str.endsWith(extension) ? str : str + extension;
