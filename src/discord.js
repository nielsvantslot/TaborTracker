import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import fs from "fs";
import path from "node:path";
import { discordToken } from "./constants.js";
import { PlayerGraphManager } from "./managers/PlayerGraphManager.js";
import { __dirname } from "./utils.js";
import generatorNotifier from "./managers/GeneratorNotifier.js";

export class Discord {
  constructor() {
    if (!Discord.instance) {
      this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
      this.client.commands = new Collection();
      this.playerGraph = new PlayerGraphManager();
      Discord.instance = this;
    }
    return Discord.instance;
  }

  getClient() {
    return this.client;
  }

  async run() {
    await this.loadCommands();
    this.client.on("ready", () => {
      console.log(`Logged in as ${this.client.user.tag}!`);

      this.playerGraph.run();
    });

    this.client.login(discordToken);
    this.handleCommands();
    setInterval(this.publishNotification, 60000);
  }

  publishNotification() {
    generatorNotifier.publish(1);
  }

  handleCommands() {
    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`,
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        }
      }
    });
  }

  async loadCommands() {
    const foldersPath = path.join(__dirname, "commands");
    try {
      const commandFolders = await fs.promises.readdir(foldersPath);

      for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = await fs.promises.readdir(commandsPath);

        for (const file of commandFiles) {
          if (file.endsWith(".js")) {
            const filePath = path.join(commandsPath, file);
            try {
              const command = await import(filePath);
              if ("data" in command && "execute" in command) {
                this.client.commands.set(command.data.name, command);
              } else {
                console.log(
                  `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
                );
              }
            } catch (error) {
              console.error(`Error loading command from ${filePath}:`, error);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error while loading commands:", error);
    }
  }
}

const instance = new Discord();
Object.freeze(instance);

export default instance;
