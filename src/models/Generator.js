import GeneratorDataManager from "../managers/GeneratorDataManager.js";
import generatorNotifier from "../managers/GeneratorNotifier.js";

export default class Generator {
  constructor(uid) {
    this.data = new GeneratorDataManager();
    this.userId = uid;
    this.fuel = 0;
    this.level = 1;
    this.powered = false;
  }

  addFuel() {
    this.fuel = Math.min(
      (this.level + 1) * 6 * 60 * 4,
      this.fuel + (this.level + 1) * 6 * 60,
    );
  }

  decreaseFuel(amount) {
    if (this.fuel > 0) {
      this.fuel -= amount;
      console.log(`${this.name} fuel decreased to ${this.fuel}`);
    } else {
      console.log(`${this.name} has run out of fuel`);
    }
  }

  upgradeLevel() {
    this.level = Math.min(this.level + 1, 3);
  }

  _getMaxFuel() {
    return this.data.getHoursPerGasCanByLevel(this.level) * 60 * 4;
  }

  powerOff() {
    generatorNotifier.unsubscribe(this);
    this.powered = false;
  }

  powerOn() {
    generatorNotifier.subscribe(this);
    this.powered = true;
  }

  isPowered() {
    return this.powered;
  }

  getUserId() {
    return this.userId;
  }

  getFuel() {
    return this.fuel;
  }

  getFuelLevel() {
    return (this.fuel / this._getMaxFuel()) * 100 + "%";
  }

  getLevel() {
    return this.level;
  }

  getTimeLeft() {
    return this.fuel / 60;
  }
}
