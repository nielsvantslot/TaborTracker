import GeneratorDataManager from "../managers/GeneratorDataManager.js";
import generatorNotifier from "../managers/GeneratorNotifier.js";
import discord from "../discord.js";

export default class Generator {
  constructor(uid) {
    this.data = new GeneratorDataManager();
    this.userId = uid;
    this.fuel = 0;
    this.level = 1;
    this.powered = false;
    this.notify = this.notify.bind(this);
  }

  addFuel() {
    this.fuel = Math.min(
      (this.level + 1) * 6 * 60 * 4,
      this.fuel + (this.level + 1) * 6 * 60,
    );
  }

  notify(amount) {
    this.decreaseFuel(amount);
    if (this.fuel / 60 === 1) {
      const client = discord.getClient();
      const user = client.users.fetch(this.userId);
      user.send(this.getFuelLevel());
    }
  }

  async decreaseFuel(amount) {
    if (this.fuel > 0) {
      this.fuel -= amount;
      console.log(`${this.userId} fuel decreased to ${this.fuel}`);
    } else {
      this.powerOff();
      console.log(`${this.userId} has run out of fuel`);
    }
  }

  upgradeLevel() {
    const percentage = this.getFuelLevel() / 100;
    this.level = Math.min(this.level + 1, 3);
    this.fuel = this._getMaxFuel() * percentage;
  }

  _getMaxFuel() {
    return this.data.getHoursPerGasCanByLevel(this.level) * 60 * 4;
  }

  powerOff() {
    generatorNotifier.unsubscribe(this.notify);
    this.powered = false;
  }

  powerOn() {
    generatorNotifier.subscribe(this.notify);
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
    return Math.floor((this.fuel / this._getMaxFuel()) * 100);
  }

  getLevel() {
    return this.level;
  }

  getTimeLeft() {
    return Math.floor(this.fuel / 60);
  }
}
