import jsonData from '../../data/WaterContainerData.json';

class WaterContainerManager {
  constructor() {
    this.containers = JSON.parse(jsonData)["WaterContainersData"];
  }

  getAllContainers() {
    return this.containers.map(container => ({
      name: container.Container,
      waterCapacity: container["Water Capacity"]
    }));
  }

  getContainerByName(name) {
    return this.containers.find(container => container.Container === name);
  }

  getContainerCapacityByName(name) {
    const container = this.getContainerByName(name);
    return container ? container["Water Capacity"] : null;
  }
}
