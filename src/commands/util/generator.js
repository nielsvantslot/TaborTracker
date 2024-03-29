import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import generatorManager from "../../managers/GeneratorManager.js";

const data = new SlashCommandBuilder()
  .setName("generator")
  .setDescription("Manage your generator.");

const execute = async (interaction) => {
  const generator = generatorManager.getByUserId(interaction.user.id);
  const ui = new EmbedBuilder().setTitle("Generator").addFields(
    {
      name: "Generator status",
      value: `Generator level: ${generator.getLevel()}`,
    },
    {
      name: "ETA",
      value: `${generator.getTimeLeft()} hours left`,
      inline: true,
    },
    { name: "Canister", value: `${generator.getFuel()}/4`, inline: true },
  );
  console.log(generatorManager);
  await interaction.reply({ embeds: [ui] });
};

export { data, execute };
