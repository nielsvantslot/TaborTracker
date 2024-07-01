export default class PlayerGraphConfigManager {
  #dataManager
  #generators;

  static #instance

  constructor() {
    if (PlayerGraphConfigManager.#instance) {
      throw new Error("DONT use this constructor, try getInstance()");
    }
    PlayerGraphConfigManager.#instance = this;
    this.#dataManager = DynamicDataManager.getInstance("playerGraphConfig");
    this.#generators = new HashMap();
  }

  static getInstance() {
    return (
      PlayerGraphManger.#instance ??
      (PlayerGraphManger.#instance = new PlayerGraphManger())
    );
  }

  async getAllConfigs() {
    return await this.#dataManager.readAllRecords();
  }

  async setChannelForGuild(guildId, channelId) {}

  async setMessageIdForGuild(guildId, messageId) {}
}
