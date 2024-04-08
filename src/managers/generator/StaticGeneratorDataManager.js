import StaticDataManager from "../../managers/data/StaticDataManager.js";

export default class StaticGeneratorDataManager {
  constructor() {
    this.staticDataManager = new StaticDataManager("generatorData.json");
    this.generators = null;
    this.loadGenerators();
  }

  async loadGenerators() {
    try {
      this.generators = await this.staticDataManager.getData();
    } catch (error) {
      console.error("Error loading generator data:", error);
      this.generators = [];
    }
  }

  /**
   * Retrieves all generators.
   * @returns {Array} - Array of generator objects.
   */
  getAllGenerators() {
    return this.generators.map((generator) => ({
      level: generator.level,
      hoursPerGasCan: generator.hoursPerGasCan,
    }));
  }

  /**
   * Retrieves a generator by its level.
   * @param {number} level - The level of the generator.
   * @returns {Object|null} - The generator object, or null if not found.
   */
  getGeneratorByLevel(level) {
    return this.generators.find((generator) => generator.level === level);
  }

  /**
   * Retrieves the hours per gas can for a generator by its level.
   * @param {number} level - The level of the generator.
   * @returns {number|null} - The hours per gas can, or null if not found.
   */
  getHoursPerGasCanByLevel(level) {
    const generator = this.getGeneratorByLevel(level);
    return generator ? generator.hoursPerGasCan : null;
  }
}
