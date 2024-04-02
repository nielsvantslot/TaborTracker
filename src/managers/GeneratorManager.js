import HashMap from "../structs/Hashmap.js";
import Generator from "../models/Generator.js";

class GeneratorManager {
  constructor() {
    if (!GeneratorManager.instance) {
      this.generators = new HashMap();
      GeneratorManager.instance = this;
    }
    return GeneratorManager.instance;
  }

  getByUserId(uid) {
    let generator = this.generators.get(uid);
    if (!generator) {
      generator = new Generator(uid);
      this.generators.put(uid, generator);
    }
    return generator;
  }
}

const instance = new GeneratorManager();
Object.freeze(instance);

export default instance;
