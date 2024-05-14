import { SlashCommandBuilder } from "discord.js";
import generatorManager from "../../managers/generator/GeneratorManager.js";

const data = new SlashCommandBuilder()
  .setName("reset")
  .setDescription("Resets an instace")
  .addSubcommand((subcommand) =>
    subcommand.setName("generator").setDescription("Resets your generator"),
  );

function resetGenerator(interaction) {
  generatorManager.delete(interaction.user.id);
  interaction.reply({
    content: "Your generator has been reset.",
    ephemeral: true,
  });
}

async function execute(interaction) {
  switch (interaction.options.getSubcommand()) {
    case "generator":
      resetGenerator(interaction);
      break;
  }
}

export { data, execute };
