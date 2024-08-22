import { roleId } from "../../../util/constants.js";
import Discord from "../../discord.js";
import PlayerGraphConfigManager from "./PlayerGraphConfigManager.js";

export default class PlayerGraphDisplay {
  #graph;

  #currentPlayerCount;

  constructor(graph, currentPlayerCount) {
    this.#graph = graph;
    this.#currentPlayerCount = currentPlayerCount;
  }

  async displayGraph() {
    await this.#reviseMessage();
  }

  async #reviseMessage() {
    try {
      const configs = await PlayerGraphConfigManager.getInstance().getAll();

      const promises = configs.map(async (config) => {
        try {
          let message = "";
          if (config.getRoleId()) {
            message += `<@&${config.getRoleId()}> `
          }
          message += `Number of players online: ${this.#currentPlayerCount}`;

          if (config.getMessageId() != null) {
            await this.#editCurrentMessage(config, {
              content: message,
              files: [this.#graph],
            });
          } else {
            try {
              await this.#sendNewMessage(config, {
                content: message,
                files: [this.#graph],
              });
            } catch (error) {
              console.error(error);
            }
          }
        } catch (error) {
          console.error("Error sending message:", error);
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.error("Error retrieving configs:", error);
    }
  }

  async #editCurrentMessage(config, message) {
    try {
      const channel = Discord.getClient().channels.cache.get(config.getChannelId());
      const orig = await channel.messages.fetch(config.getMessageId());
      await orig.edit(message);
    } catch (error) {
      try {
        await this.#sendNewMessage(config, message);
      } catch (error) {
        console.error(error);
      }
    }
  }

  async #sendNewMessage(config, message) {
    const channel = Discord.getClient().channels.cache.get(config.getChannelId());
    if (!channel) throw new Error("Channel not found.");

    const res = await channel.send(message);
    config.setMessageId(res.id);
  }
}
