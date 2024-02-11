import jsonData from '../../data/generatorData.json';

class GeneratorManager {
  constructor(jsonData) {
    this.generators = JSON.parse(jsonData)["generatorData"];
  }

  getAllGenerators() {
    return this.generators.map(generator => ({
      level: generator.level,
      hoursPerGasCan: generator.hoursPerGasCan
    }));
  }

  getGeneratorByLevel(level) {
    return this.generators.find(generator => generator.level === level);
  }

  getHoursPerGasCanByLevel(level) {
    const generator = this.getGeneratorByLevel(level);
    return generator ? generator.hoursPerGasCan : null;
  }
}
