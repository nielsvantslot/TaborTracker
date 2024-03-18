import { Client, GatewayIntentBits } from "discord.js";
import { discordToken } from "./constants.js";
import { PlayerGraphManager } from "./managers/PlayerGraphManager.js";

export class Discord {
  async _constructor() {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    this.playerGraph = new PlayerGraphManager();
  }

  static getInstance() {
    if (!Discord.instance) {
      Discord.instance = new this();
    }

    return Discord.instance;
  }

  getClient() {
    return this.client;
  }

  async run() {
    await this._constructor();
    this.client.on("ready", () => {
      console.log(`Logged in as ${this.client.user.tag}!`);

      // PLayer graph logic
      this.playerGraph.run();
    });

    this.client.login(discordToken);
  }
}
