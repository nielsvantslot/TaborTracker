import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("generator")
  .setDescription("Manage your generator.");

const execute = async (interaction) => {
  const ui = new EmbedBuilder()
    .setTitle("Generator")
    .addFields(
      { name: "Generator status", value: "Generator level: 1" },
      { name: "ETA", value: "12 hours left", inline: true },
      { name: "Canister", value: "3/4", inline: true },
    );
  await interaction.reply({ embeds: [ui] });
};

export { data, execute };
