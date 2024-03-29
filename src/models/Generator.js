import GeneratorDataManager from "../managers/GeneratorDataManager.js";

export default class Generator {
  constructor(uid) {
    this.data = new GeneratorDataManager();
    this.userId = uid;
    this.fuel = 2;
    this.level = 3;
  }

  decreaseFuel(amount) {
    if (this.fuel > 0) {
      this.fuel -= amount;
      console.log(`${this.name} fuel decreased to ${this.fuel}`);
    } else {
      console.log(`${this.name} has run out of fuel`);
    }
  }

  getUserId() {
    return this.userId;
  }

  getFuel() {
    return this.fuel;
  }

  getLevel() {
    return this.level;
  }

  getTimeLeft() {
    const hoursPerGasscan = this.data.getHoursPerGasCanByLevel(this.level);
    return this.fuel * hoursPerGasscan;
  }
}
