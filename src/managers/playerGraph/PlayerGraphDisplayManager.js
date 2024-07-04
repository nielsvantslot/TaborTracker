import Discord from "../../discord.js";
import { channelId, roleId } from "../../../util/constants.js";
import PlayerGraphConfigManager from "./PlayerGraphConfigManager.js";

export default class PlayerGraphDisplay {
  #graph;

  #currentPlayerCount;

  #currentMessage;

  constructor(graph, currentPlayerCount, currentMessage) {
    this.#graph = graph;
    this.#currentPlayerCount = currentPlayerCount;
    this.#currentMessage = currentMessage;
  }

  getMessageId() {
    return this.#currentMessage;
  }

  async displayGraph() {
    const message = `<@&${roleId}> Number of players online: ${this.#currentPlayerCount}`;

    await this.#reviseMessage({
      content: message,
      files: [this.#graph],
    });
  }

  async #reviseMessage(message) {
    const configs = await PlayerGraphConfigManager.getInstance().getAll();
    for (const config of configs) {
      try {
        if (config.getMessageId() != null) {
          await this.#editCurrentMessage(config, message);
        } else {
          await this.#sendNewMessage(config, message);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  }

  async #editCurrentMessage(config, message) {
    try {
      const channel = Discord.getClient().channels.cache.get(config.getChannelId());
      const orig = await channel.messages.fetch(config.getMessageId());
      await orig.edit(message);
    } catch (error) {
      this.#sendNewMessage(config, message);
    }
  }

  async #sendNewMessage(config, message) {
    const channel = Discord.getClient().channels.cache.get(config.getChannelId());
    if (!channel) throw new Error("Channel not found.");

    const res = await channel.send(message);
    config.setMessageId(res.id);
  }
}
