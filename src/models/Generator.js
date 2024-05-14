import { EmbedBuilder } from "discord.js";
import generatorManager from "../managers/generator/GeneratorManager.js";
import discord from "../discord.js";
import generatorNotifier from "../managers/generator/GeneratorNotifier.js";
import StaticGeneratorDataManager from "../managers/generator/StaticGeneratorDataManager.js";
import Saveable from "./Savable.js";

/**
 * Represents a Generator object.
 * @extends Saveable
 */
export default class Generator extends Saveable {
  /**
   * Create a Generator.
   * @param {string} uid - The user ID.
   * @param {number} [fuel=0] - The initial fuel amount (optional, default is 0).
   * @param {number} [level=1] - The initial level (optional, default is 1).
   * @param {boolean} [powered=false] - The initial powered state (optional, default is false).
   * @param {number} [lastUpdated=Date.now()] - The timestamp of last update (optional, default is current timestamp).
   */
  constructor(
    uid,
    fuel = 0,
    level = 1,
    powered = false,
    lastUpdated = Date.now(),
  ) {
    super();
    /** @type {StaticGeneratorDataManager} */
    this.data = new StaticGeneratorDataManager();
    /** @type {string} */
    this.userId = uid;
    /** @type {number} */
    this.fuel = fuel;
    /** @type {number} */
    this.level = level;
    /** @type {boolean} */
    this.powered = powered;
    /** @type {number} */
    this.lastUpdated = lastUpdated;
    /** @type {function} */
    this.notify = this.notify.bind(this);
    // Wrap the methods that should trigger save
    this.decreaseFuel = this.withSave(this.decreaseFuel);
    this.addFuel = this.withSave(this.addFuel);
    this.upgradeLevel = this.withSave(this.upgradeLevel);
    this.powerOff = this.withSave(this.powerOff);
    this.powerOn = this.withSave(this.powerOn);
  }

  static revive(instance) {
    const elapsedTime = Date.now() - instance.lastUpdated;
    const fuelConsumed = Math.floor(elapsedTime / (1000 * 60));
    instance.fuel = Math.max(0, instance.fuel - fuelConsumed);

    if (instance.fuel < 1) {
      instance.powered = false;
    }

    const generator = new this(
      instance.userId,
      instance.fuel,
      instance.level,
      instance.powered,
      instance.lastUpdated,
    );
    generator.powerOn();
    return generator;
  }

  /**
   * Notifies the user about the generator status.
   * @param {number} amount - The amount of fuel.
   * @returns {Promise<void>}
   */
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

  /**
   * Adds fuel to the generator.
   * @returns {Promise<void>}
   */
  async addFuel() {
    const hoursPerGasCan = await this.data.getHoursPerGasCanByLevel(this.level);
    if (hoursPerGasCan !== null) {
      const fuelToAdd = hoursPerGasCan * 60;
      const fuelCap = fuelToAdd * 4;
      this.fuel = Math.min(this.fuel + fuelToAdd, fuelCap);
    }
  }

  /**
   * Decreases the fuel of the generator.
   * @param {number} amount - The amount to decrease.
   */
  decreaseFuel(amount) {
    this.fuel -= amount;
    if (this.fuel < 1) {
      this.powerOff();
    }
  }

  /**
   * Upgrades the level of the generator.
   * @returns {Promise<void>}
   */
  async upgradeLevel() {
    const percentage = (await this.getFuelLevel()) / 100;
    this.level = Math.min(this.level + 1, 3);
    this.fuel = (await this._getMaxFuel()) * percentage;
  }

  /**
   * Gets the maximum fuel capacity.
   * @returns {Promise<number>} The maximum fuel capacity.
   */
  async _getMaxFuel() {
    return (await this.data.getHoursPerGasCanByLevel(this.level)) * 60 * 4;
  }

  /**
   * Powers off the generator.
   */
  powerOff() {
    generatorNotifier.unsubscribe(this.notify);
    this.powered = false;
  }

  /**
   * Powers on the generator.
   */
  powerOn() {
    if (this.fuel < 1) return;
    generatorNotifier.subscribe(this.notify);
    this.powered = true;
  }

  /**
   * Checks if the generator is powered.
   * @returns {boolean} True if powered, false otherwise.
   */
  isPowered() {
    return this.powered;
  }

  /**
   * Gets the user ID.
   * @returns {string} The user ID.
   */
  getUserId() {
    return this.userId;
  }

  /**
   * Gets the current fuel amount.
   * @returns {number} The current fuel amount.
   */
  getFuel() {
    return this.fuel;
  }

  /**
   * Gets the fuel level percentage.
   * @returns {Promise<number>} The fuel level percentage.
   */
  async getFuelLevel() {
    return Math.floor((this.fuel / (await this._getMaxFuel())) * 100);
  }

  /**
   * Gets the generator level.
   * @returns {number} The generator level.
   */
  getLevel() {
    return this.level;
  }

  /**
   * Gets the time left until the generator runs out of fuel.
   * @returns {number} The time left in hours.
   */
  getTimeLeft() {
    return Math.floor(this.fuel / 60);
  }

  /**
   * Saves the generator data.
   * @returns {Promise<void>}
   */
  async save() {
    await generatorManager.update(this.userId, this);
  }

  /**
   * Serializes the generator data.
   * @returns {object} The serialized data.
   */
  serialize() {
    return {
      userId: this.userId,
      fuel: this.fuel,
      level: this.level,
      powered: this.powered,
      lastUpdated: Date.now(),
    };
  }
}
