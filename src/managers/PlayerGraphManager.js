import { channelId, refreshRate, roleId } from "../../util/constants.js";
import { Graph } from "../graph.js";
import { Scraper } from "../scraper.js";
import discord from "../discord.js";
import fs from "fs";

export class PlayerGraphManager {
  constructor() {
    this.playerGraph = new Graph();
    this.scraper = new Scraper();
    this.currentMessage = null;
    this.dataFile = "./data/dynamic/playerGraphData.json";
  }

  run() {
    this.ensureStorage();
    const data = this._getData();
    if (data) this.playerGraph.setData(data);

    this._sendPlayerData();
    setInterval(() => {
      this._sendPlayerData();
    }, refreshRate);
  }

  ensureStorage() {
    fs.access(this.dataFile, fs.constants.F_OK, (err) => {
      if (err) {
        fs.writeFile(this.dataFile, "", (err) => {
          if (err) {
            console.error("Error creating file:", err);
          } else {
            console.log(
              "\x1b[32m%s\x1b[0m",
              `File ${this.dataFile} created successfully.`,
            );
          }
        });
      } else {
        console.log(
          "\x1b[33m%s\x1b[0m",
          `File ${this.dataFile} already exists.`,
        );
      }
    });
  }

  _getData() {
    try {
      const data = fs.readFileSync(this.dataFile, "utf8");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error reading file:", error);
      return null;
    }
  }

  _saveData(data) {
    try {
      fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2), "utf8");
      console.log(
        "\x1b[32m%s\x1b[0m",
        `Data has been written to ${this.dataFile}`,
      );
    } catch (error) {
      console.error("Error writing file:", error);
    }
  }

  async _sendPlayerData() {
    const data = await this.scraper.getPlayersOnline();

    if (!data) return;
    const playerData = await this.playerGraph.push(data);
    this._saveData(playerData);

    const image = await this.playerGraph.generateImage();
    const message = `<@&${roleId}> Number of players online: ${data.players}`;

    await this._reviseMessage({
      content: message,
      files: [image],
    });
  }

  async _reviseMessage(message) {
    try {
      if (this.currentMessage) {
        await this._editCurrentMessage(message);
      } else {
        await this._sendNewMessage(message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  async _editCurrentMessage(message) {
    await this.currentMessage.edit(message);
  }

  async _sendNewMessage(message) {
    const channel = discord.getClient().channels.cache.get(channelId);
    if (!channel) throw new Error("Channel not found.");

    this.currentMessage = await channel.send(message);
  }
}
