import StaticGeneratorDataManager from "../managers/generator/StaticGeneratorDataManager.js";
import generatorNotifier from "../managers/generator/GeneratorNotifier.js";
import discord from "../discord.js";
import { EmbedBuilder } from "discord.js";

export default class Generator {
  constructor(uid) {
    this.data = new StaticGeneratorDataManager();
    this.userId = uid;
    this.fuel = 0;
    this.level = 1;
    this.powered = false;
    this.notify = this.notify.bind(this);
  }

  async notify(amount) {
    this.decreaseFuel(amount);
    if (this.fuel / 60 === 1) {
      const client = discord.getClient();
      const user = await client.users.fetch(this.userId);
      const warning = new EmbedBuilder()
        .setColor("#ffcc00")
        .setTitle("Generator Reminder")
        .setDescription("Your generator only has 1 hour left!")
        .setTimestamp();
      user.send({ embeds: [warning] });
    }
  }

  async addFuel() {
    const hoursPerGasCan = await this.data.getHoursPerGasCanByLevel(this.level);
    if (hoursPerGasCan !== null) {
      const fuelToAdd = hoursPerGasCan * 60;
      const fuelCap = fuelToAdd * 4;
      this.fuel = Math.min(this.fuel + fuelToAdd, fuelCap);
    }
  }

  decreaseFuel(amount) {
    if (this.fuel > 0) {
      this.fuel -= amount;
      console.log(`${this.userId} fuel decreased to ${this.fuel}`);
    } else {
      this.powerOff();
      console.log(`${this.userId} has run out of fuel`);
    }
  }

  async upgradeLevel() {
    const percentage = (await this.getFuelLevel()) / 100;
    this.level = Math.min(this.level + 1, 3);
    this.fuel = (await this._getMaxFuel()) * percentage;
  }

  async _getMaxFuel() {
    return (await this.data.getHoursPerGasCanByLevel(this.level)) * 60 * 4;
  }

  powerOff() {
    generatorNotifier.unsubscribe(this.notify);
    this.powered = false;
  }

  powerOn() {
    if (this.fuel < 1) return;
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

  async getFuelLevel() {
    return Math.floor((this.fuel / (await this._getMaxFuel())) * 100);
  }

  getLevel() {
    return this.level;
  }

  getTimeLeft() {
    return Math.floor(this.fuel / 60);
  }
}
