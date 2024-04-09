import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import fs from "fs";
import path from "node:path";
import { discordToken } from "../util/constants.js";
import { PlayerGraphManager } from "./managers/PlayerGraphManager.js";
import { __dirname } from "./utils.js";
import generatorNotifier from "./managers/generator/GeneratorNotifier.js";

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
      console.log("\x1b[32m%s\x1b[0m", `Logged in as ${this.client.user.tag}!`);

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
    const foldersPath = path.join(__dirname, "src/commands");
    try {
      const commandFolders = await fs.promises.readdir(foldersPath);

      for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const unFilteredcommandFiles = await fs.promises.readdir(commandsPath);
        const commandFiles = unFilteredcommandFiles.filter((file) =>
          file.endsWith(".js"),
        );

        for (const file of commandFiles) {
          const filePath = `file://${path.resolve(commandsPath, file).replace(/\\/g, "/")}`;
          try {
            const command = await import(filePath);
            if ("data" in command && "execute" in command) {
              this.client.commands.set(command.data.name, command);
            } else {
              console.log(
                "\x1b[33m%s\x1b[0m",
                `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
              );
            }
          } catch (error) {
            console.error(`Error loading command from ${filePath}:`, error);
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
