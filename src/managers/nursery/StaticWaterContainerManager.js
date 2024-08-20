import StaticDataManager from "../../managers/data/StaticDataManager.js";

export default class StaticWaterContainerManager {
  #dataManager;

  static #mainContainer = "Nursery Tank";

  constructor() {
    this.#dataManager = StaticDataManager.getInstance("waterContainerData");
  }

  async getMainContainer() {
    return (
      await this.#dataManager
        .getWhere("name", "==", StaticWaterContainerManager.#mainContainer)
      ).getResult();
  }

  async getAllContainers() {
    return await this.#dataManager.getData();
  }

  async getContainerByName(name) {
    const res = ((await this.#dataManager.getWhere("name", "==", name)).getResult());
    if (!res) return null;
    if (typeof res !== 'object') return null;
    return res[0];
  }

  async getContainerCapacityByName(name) {
    const container = await this.getContainerByName(name);
    return container ? container.capacity : null;
  }
}
