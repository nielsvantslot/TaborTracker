import StaticDataManager from "../../managers/data/StaticDataManager.js";

/**
 * Manager for static generator data.
 */
export default class StaticGeneratorDataManager {
  /**
   * Initializes the StaticGeneratorDataManager.
   */
  constructor() {
    this.staticDataManager = StaticDataManager.getInstance("generatorData");
    this.generatorsPromise = this.loadGenerators();
  }

  /**
   * Loads the generator data asynchronously.
   * @returns {Promise<void>} A promise that resolves when the generator data is loaded.
   */
  async loadGenerators() {
    try {
      this.generators = await this.staticDataManager.getData();
    } catch (error) {
      console.error("Error loading generator data:", error);
      this.generators = [];
    }
  }

  /**
   * Waits for the initialization of generator data.
   * @returns {Promise<void>} A promise that resolves when the generator data is initialized.
   */
  async waitForInitialization() {
    await this.generatorsPromise;
  }

  /**
   * Retrieves all generators.
   * @returns {Promise<Array>} Array of generator objects.
   */
  async getAllGenerators() {
    await this.waitForInitialization();
    return this.generators.data.map((generator) => ({
      level: generator.level,
      hoursPerGasCan: generator.hoursPerGasCan,
    }));
  }

  /**
   * Retrieves a generator by its level.
   * @param {number} level - The level of the generator.
   * @returns {Promise<Object|null>} The generator object, or null if not found.
   */
  async getGeneratorByLevel(level) {
    await this.waitForInitialization();
    return this.generators.data.find((generator) => generator.level === level);
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
