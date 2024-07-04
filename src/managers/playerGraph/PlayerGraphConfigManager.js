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

    if (res) {
      config = new PlayerGraphConfig(guildId, channelId);
      this.#configs.put(guildId, config);
    } else if (this.#configs.get(guildId)) {
      this.#configs.get(guildId);
    } else {
      this.create(guildId, channelId);
    }
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
