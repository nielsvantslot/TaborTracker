import { Client, GatewayIntentBits } from 'discord.js';
import { discordToken, refreshRate, roleId, channelId } from './constants.js';
import { Scraper } from './scraper.js';
import { Graph } from './graph.js';

export class Discord {
  constructor() {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    this.playerGraph = new Graph();
    this.scraper = new Scraper();
    this.currentMessage = null;
  }

  async run() {
    this.client.on('ready', () => {
        console.log(`Logged in as ${this.client.user.tag}!`);
        this.sendPlayerData();
        setInterval(() => {this.sendPlayerData()}, refreshRate);
    });

    this.client.login(discordToken);
  }

  async sendPlayerData() {
    const data = await this.scraper.getPlayersOnline();

    if (!data) return;
    this.playerGraph.push(data);

    const image = await this.playerGraph.generateImage();
    const message = `<@&${roleId}> Number of players online: ${data.players}`;

    await this.reviseMessage({
      content: message,
      files: [image] }
    );
  }

  async reviseMessage(message) {
    try {
      if (this.currentMessage) {
        await this.editCurrentMessage(message);
      } else {
        await this.sendNewMessage(message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  async editCurrentMessage(message) {
    await this.currentMessage.edit(message);
  }

  async sendNewMessage(message) {
    const channel = this.client.channels.cache.get(channelId);
    if (!channel) throw new Error('Channel not found.');

    this.currentMessage = await channel.send(message);
  }
}
