import Generator from "../../models/Generator.js";
import HashMap from "../../structs/Hashmap.js";
import DynamicDataManager from "../data/DynamicDataManager.js";

class GeneratorManager {
  #dataManager;
  #generators;

  constructor() {
    if (!GeneratorManager.instance) {
      this.#dataManager = DynamicDataManager.getInstance("generators");
      this.#generators = new HashMap();
      GeneratorManager.instance = this;
    }
    return GeneratorManager.instance;
  }

  async start() {
    const generators = (
      await this.#dataManager.getWhere("powered", "==", true)
    ).getResult();
    for (const generator of generators) {
      const newGenerator = Generator.revive(generator);
      this.#generators.put(generator.userId, newGenerator);
    }
  }

  async getByUserId(uid) {
    const res = await this.#dataManager.readRecord(uid);
    let generator;
    if (res) {
      generator = new Generator(
        res.userId,
        res.fuel,
        res.level,
        res.powered,
        res.lastUpdated,
      );
      this.#generators.put(uid, generator);
    } else if (this.#generators.get(uid)) {
      generator = this.#generators.get(uid);
    } else {
      generator = this.create(uid);
    }
    return generator;
  }

  async create(id) {
    const generator = new Generator(id);
    this.#generators.put(id, generator);
    await this.#dataManager.createRecord(id, generator.serialize());
    return generator;
  }

  async getAll() {
    return await this.#dataManager.readAllRecords();
  }

  async update(id, generator) {
    this.#dataManager.updateRecord(id, generator.serialize());
  }

  async delete(id) {
    const generators = await this.#dataManager.readAllRecords();
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
