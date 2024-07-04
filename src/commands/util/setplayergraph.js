import { SlashCommandBuilder } from "discord.js";
import PlayerGraphConfigManager from "../../managers/playerGraph/PlayerGraphConfigManager.js";

const data = new SlashCommandBuilder()
  .setName("setplayergraph")
  .setDescription("Sets the player graph to this channel.");

async function execute(interaction) {
  const configs = PlayerGraphConfigManager.getInstance();
  configs.addOrUpdate(interaction.guildId, interaction.channelId);
  await interaction.reply({ content: "Registered!", ephemeral: true });
}

export { data, execute };
