import Discord from "../../discord.js";
import { channelId, roleId } from "../../../util/constants.js";

export default class PlayerGraphDisplay {
  #graph;

  #currentPlayerCount;

  #currentMessage;

  constructor(graph, currentPlayerCount) {
    this.#graph = graph;
    this.#currentPlayerCount = currentPlayerCount;
    this.#currentMessage;
  }

  async displayGraph() {
    const message = `<@&${roleId}> Number of players online: ${this.#currentPlayerCount}`;

    await this.#reviseMessage({
      content: message,
      files: [this.#graph],
    });
  }

  async #reviseMessage(message) {
    try {
      if (this.#currentMessage) {
        await this.#editCurrentMessage(message);
      } else {
        await this.#sendNewMessage(message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  async #editCurrentMessage(message) {
    await this.#currentMessage.edit(message);
  }

  async #sendNewMessage(message) {
    const channel = Discord.getClient().channels.cache.get(channelId);
    if (!channel) throw new Error("Channel not found.");

    this.#currentMessage = await channel.send(message);
  }
}
