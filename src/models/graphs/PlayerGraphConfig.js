import Saveable from "../abstracts/Saveable.js";

export default class PlayerGraphConfig extends Saveable {

  #guildId;
  #channelId;
  #messageId

  constructor(guildId, channelId) {
    super();
    this.#guildId = guildId;
    this.#channelId = channelId;
    this.#messageId = null;
  }

  getGuildId() {
    return this.#guildId;
  }

  getChannelId() {
    return this.#channelId;
  }

  setChannelId(channelId) {
    this.#channelId = channelId;
  }

  getMessageId() {
    return this.#messageId;
  }

  setMessageId(messageId) {
    this.#messageId = messageId;
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
    };
  }
}
