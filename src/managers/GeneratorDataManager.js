import jsonData from "../../data/static/generatorData.json" assert { type: "json" };

export default class GeneratorDataManager {
  constructor() {
    this.generators = jsonData["generatorData"];
  }

  getAllGenerators() {
    return this.generators.map((generator) => ({
      level: generator.level,
      hoursPerGasCan: generator.hoursPerGasCan,
    }));
  }

  getGeneratorByLevel(level) {
    return this.generators.find((generator) => generator.level === level);
  }

  getHoursPerGasCanByLevel(level) {
    const generator = this.getGeneratorByLevel(level);
    return generator ? generator.hoursPerGasCan : null;
  }
}
