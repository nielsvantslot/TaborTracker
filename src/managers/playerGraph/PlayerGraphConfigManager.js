import PlayerGraphConfig from "../../models/graphs/PlayerGraphConfig.js";
import HashMap from "../../structs/Hashmap.js";
import DynamicDataManager from "../data/DynamicDataManager.js";

/**
 * Manages player graph configurations.
 */
export default class PlayerGraphConfigManager {
  #dataManager;
  #configs;

  static #instance;

  /**
   * Creates an instance of PlayerGraphConfigManager.
   * @throws Will throw an error if the constructor is called directly, use getInstance() instead.
   */
  constructor() {
    if (PlayerGraphConfigManager.#instance) {
      throw new Error("DONT use this constructor, try getInstance()");
    }
    PlayerGraphConfigManager.#instance = this;
    this.#dataManager = DynamicDataManager.getInstance("playerGraphConfig");
    this.#configs = new HashMap();
  }

  /**
   * Gets the singleton instance of PlayerGraphConfigManager.
   * @returns {PlayerGraphConfigManager} The instance of PlayerGraphConfigManager.
   */
  static getInstance() {
    return (
      PlayerGraphConfigManager.#instance ??
      (PlayerGraphConfigManager.#instance = new PlayerGraphConfigManager())
    );
  }

  /**
   * Adds or updates a player graph configuration.
   * @param {string} guildId - The ID of the guild.
   * @param {string} channelId - The ID of the channel.
   */
  async addOrUpdate(guildId, channelId) {
    const res = await this.#dataManager.readRecord(guildId);
    let config;
    if (this.#configs.get(guildId)) {
      config = this.#configs.get(guildId);
      config.setChannelId(channelId);
    } else if (res) {
      config = PlayerGraphConfig.revive(res);
      config.setChannelId(channelId);
      this.#configs.put(guildId, config);
    } else {
      this.create(guildId, channelId);
    }
  }

  /**
   * Gets a player graph configuration by guild ID.
   * @param {string} guildId - The ID of the guild.
   * @returns {Promise<PlayerGraphConfig>} The player graph configuration.
   */
  async get(guildId) {
    const res = await this.#dataManager.readRecord(guildId);
    return PlayerGraphConfig.revive(res);
  }

  /**
   * Gets all player graph configurations.
   * @returns {Promise<PlayerGraphConfig[]>} An array of player graph configurations.
   */
  async getAll() {
    const configData = await this.#dataManager.readAllRecords();
    const configs = [];

    for (const config in configData) {
      configs.push(PlayerGraphConfig.revive(configData[config]));
    }
    return configs;
  }

  /**
   * Updates a player graph configuration.
   * @param {string} id - The ID of the configuration.
   * @param {PlayerGraphConfig} config - The player graph configuration.
   */
  async update(id, config) {
    this.#dataManager.updateRecord(id, config.serialize());
  }

  /**
   * Creates a new player graph configuration.
   * @param {string} guildId - The ID of the guild.
   * @param {string} channelId - The ID of the channel.
   * @returns {Promise<PlayerGraphConfig>} The created player graph configuration.
   */
  async create(guildId, channelId) {
    const config = new PlayerGraphConfig(guildId, channelId);
    this.#configs.put(guildId, config);
    await this.#dataManager.createRecord(guildId, config.serialize());
    return config;
  }

  /**
   * Gets all player graph configurations from the data manager.
   * @returns {Promise<Object>} All player graph configurations.
   */
  async getAllConfigs() {
    return await this.#dataManager.readAllRecords();
  }

  /**
   * Deletes a player graph configuration by ID.
   * @param {string} id - The ID of the configuration.
   */
  async delete(id) {
    await this.#dataManager.deleteRecord(id);
  }
}
