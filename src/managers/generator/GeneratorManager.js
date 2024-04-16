import Generator from "../../models/Generator.js";
import DynamicDataManager from "../data/DynamicDataManager.js";

class GeneratorManager {
  constructor() {
    if (!GeneratorManager.instance) {
      this.dataManager = DynamicDataManager.getInstance("generators");
      GeneratorManager.instance = this;
    }
    return GeneratorManager.instance;
  }

  async create(generatorData) {
    const generator = new Generator(generatorData);
    await this.saveGenerator(generator);
    return generator;
  }

  async getAll() {
    return await this.dataManager.readAllRecords();
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
}

const instance = new GeneratorManager();
Object.freeze(instance);

export default instance;
