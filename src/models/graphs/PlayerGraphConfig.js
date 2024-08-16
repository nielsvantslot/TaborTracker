import PlayerGraphConfigManager from "../../managers/playerGraph/PlayerGraphConfigManager.js";
import Saveable from "../abstracts/Saveable.js";

export default class PlayerGraphConfig extends Saveable {

  #guildId;
  #channelId;
  #messageId
  #roleId;

  constructor(guildId, channelId, messageId = null, roleId = null) {
    super();
    this.#guildId = guildId;
    this.#channelId = channelId;
    this.#messageId = messageId;
    this.#roleId = roleId;

    this.setChannelId = this.withSave(this.setChannelId);
    this.setMessageId = this.withSave(this.setMessageId);
    this.setRoleId = this.withSave(this.setRoleId);
  }

  getGuildId() {
    return this.#guildId;
  }

  getChannelId() {
    return this.#channelId;
  }

  setChannelId(channelId) {
    this.#channelId = channelId;
    this.#messageId = null;
  }

  getMessageId() {
    return this.#messageId;
  }

  setMessageId(messageId) {
    this.#messageId = messageId;
  }

  getRoleId() {
    return this.#roleId;
  }

  setRoleId(roleId) {
    this.#roleId = roleId;
  }

  static revive(instance) {
    const config = new this(
      instance.guildId,
      instance.channelId,
      instance.messageId,
      instance.roleId,
    );
    return config;
  }

  /**
   * Saves the generator data.
   * @returns {Promise<void>}
   */
  async save() {
    await PlayerGraphConfigManager.getInstance().update(this.#guildId, this);
  }

  /**
   * Serializes the node data.
   * @returns {object} The serialized data.
   */
  serialize() {
    return {
      guildId: this.#guildId,
      channelId: this.#channelId,
      messageId: this.#messageId,
      roleId: this.#roleId,
    };
  }
}
