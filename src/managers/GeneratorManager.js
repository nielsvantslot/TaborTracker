import HashMap from "../structs/Hashmap";

export default class GeneratorManager {
  constructor() {
    this.generators = new HashMap();
  }

  subscribe(generator) {
    this.generators.put(generator.getUserId(), generator);
  }

  notify(amount) {
    this.generators.forEach((generator) => {
      generator.decreaseFuel(amount);
    });
  }

  getByUserId(uid) {
    this.generators.get(uid);
  }
}
