import DynamicDataManager from "./DynamicDataManager.js";
import Generator from "../../models/Generator.js";

class GeneratorManager {
  constructor() {
    if (!GeneratorManager.instance) {
      this.dataManager = new DynamicDataManager("generators.json");
      GeneratorManager.instance = this;
    }
    return GeneratorManager.instance;
  }

  async create(generatorData) {
    const generator = new Generator(generatorData);
    await this.saveGenerator(generator);
    return generator;
  }

  async readAll() {
    const generators = await this.readDataFromFile();
    return Object.values(generators);
  }

  async update(id, newData) {
    const generators = await this.readDataFromFile();
    if (!generators[id]) {
      throw new Error("Generator not found");
    }
    generators[id].update(newData);
    await this.saveDataToFile(generators);
    return generators[id];
  }

  async delete(id) {
    const generators = await this.readDataFromFile();
    if (!generators[id]) {
      throw new Error("Generator not found");
    }
    delete generators[id];
    await this.saveDataToFile(generators);
  }

  async readDataFromFile() {
    await this.dataManager.initializeFile();
    const data = await this.dataManager.getData();
    return data || {};
  }

  async saveDataToFile(data) {
    await this.dataManager.saveData(data);
  }
}

const instance = new GeneratorManager();
Object.freeze(instance);

export default instance;
