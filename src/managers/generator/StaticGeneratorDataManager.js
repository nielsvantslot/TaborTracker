import StaticDataManager from "../../managers/data/StaticDataManager.js";

export default class StaticGeneratorDataManager {
  constructor() {
    this.staticDataManager = new StaticDataManager("generatorData.json");
    this.generatorsPromise = this.loadGenerators();
  }

  async loadGenerators() {
    try {
      this.generators = await this.staticDataManager.getData();
    } catch (error) {
      console.error("Error loading generator data:", error);
      this.generators = [];
    }
  }

  async waitForInitialization() {
    await this.generatorsPromise;
  }

  /**
   * Retrieves all generators.
   * @returns {Array} - Array of generator objects.
   */
  async getAllGenerators() {
    await this.waitForInitialization();
    return this.generators.generatorData.map((generator) => ({
      level: generator.level,
      hoursPerGasCan: generator.hoursPerGasCan,
    }));
  }

  /**
   * Retrieves a generator by its level.
   * @param {number} level - The level of the generator.
   * @returns {Object|null} - The generator object, or null if not found.
   */
  async getGeneratorByLevel(level) {
    await this.waitForInitialization();
    return this.generators.generatorData.find(
      (generator) => generator.level === level,
    );
  }

  /**
   * Retrieves the hours per gas can for a generator by its level.
   * @param {number} level - The level of the generator.
   * @returns {number|null} - The hours per gas can, or null if not found.
   */
  async getHoursPerGasCanByLevel(level) {
    const generator = await this.getGeneratorByLevel(level);
    return generator ? generator.hoursPerGasCan : null;
  }
}
