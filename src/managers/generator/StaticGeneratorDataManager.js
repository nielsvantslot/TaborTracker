import StaticDataManager from "../../managers/data/StaticDataManager.js";

/**
 * Manager for static generator data.
 */
export default class StaticGeneratorDataManager {
  #staticDataManager;

  /**
   * Initializes the StaticGeneratorDataManager.
   */
  constructor() {
    this.#staticDataManager = StaticDataManager.getInstance("generatorData");
  }

  /**
   * Retrieves all generators.
   * @returns {Promise<Array>} Array of generator objects.
   */
  async getAllGenerators() {
    return await this.#staticDataManager.getData();
  }

  /**
   * Retrieves a generator by its level.
   * @param {number} level - The level of the generator.
   * @returns {Promise<Object|null>} The generator object, or null if not found.
   */
  async getGeneratorByLevel(level) {
    const data = await this.getAllGenerators();
    return data[level] ? data[level] : null;
  }

  /**
   * Retrieves the hours per gas can for a generator by its level.
   * @param {number} level - The level of the generator.
   * @returns {Promise<number|null>} The hours per gas can, or null if not found.
   */
  async getHoursPerGasCanByLevel(level) {
    const generator = await this.getGeneratorByLevel(level);
    return generator ? generator.hoursPerGasCan : null;
  }
}
