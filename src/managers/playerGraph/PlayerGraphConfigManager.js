import PlayerGraphConfig from "../../models/graphs/PlayerGraphConfig.js";
import HashMap from "../../structs/Hashmap.js";
import DynamicDataManager from "../data/DynamicDataManager.js";

export default class PlayerGraphConfigManager {
  #dataManager
  #configs;

  static #instance

  constructor() {
    if (PlayerGraphConfigManager.#instance) {
      throw new Error("DONT use this constructor, try getInstance()");
    }
    PlayerGraphConfigManager.#instance = this;
    this.#dataManager = DynamicDataManager.getInstance("playerGraphConfig");
    this.#configs = new HashMap();
  }

  static getInstance() {
    return (
      PlayerGraphConfigManager.#instance ??
      (PlayerGraphConfigManager.#instance = new PlayerGraphConfigManager())
    );
  }

  async addOrUpdate(guildId, channelId) {
    const res = await this.#dataManager.readRecord(guildId);
    let config;
    if (this.#configs.get(guildId)) {
      config = this.#configs.get(guildId);
      config.setChannelId(channelId);
    }
    else if (res) {
      config = PlayerGraphConfig.revive(res);
      config.setChannelId(channelId);
      this.#configs.put(guildId, config);
    } else {
      this.create(guildId, channelId);
    }
  }

  async getAll() {
    const configData = await this.#dataManager.readAllRecords();
    const configs = []

    for (const config in configData) {
      configs.push(PlayerGraphConfig.revive(configData[config]))
    }
    return configs;
  }

  async update(id, config) {
    this.#dataManager.updateRecord(id, config.serialize());
  }

  async create(guildId, channelId) {
    const config = new PlayerGraphConfig(guildId, channelId);
    this.#configs.put(guildId, config);
    await this.#dataManager.createRecord(guildId, config.serialize());
    return config;
  }

  async getAllConfigs() {
    return await this.#dataManager.readAllRecords();
  }

  async setChannelForGuild(guildId, channelId) {}

  async setMessageIdForGuild(guildId, messageId) {}
}
