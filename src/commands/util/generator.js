import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import generatorManager from "../../managers/generator/GeneratorManager.js";

const commandData = new SlashCommandBuilder()
  .setName("generator")
  .setDescription("Manage your generator.");

async function execute(interaction) {
  try {
    const userId = interaction.user.id;
    const generator = await generatorManager.getByUserId(userId);
    const { ui, row } = await generateUI(generator);

    const response = await interaction.reply({
      embeds: [ui],
      components: [row],
      ephemeral: true,
    });

    await handleConfirmation(interaction, response, generator);
  } catch (error) {
    console.error("Error executing command:", error);
    await interaction.reply({
      content: "An error occurred while executing the command.",
      ephemeral: true,
    });
  }
}

async function handleConfirmation(interaction, response, generator) {
  const collectorFilter = (i) => i.user.id === interaction.user.id;
  while (true) {
    try {
      const confirmation = await response.awaitMessageComponent({
        filter: collectorFilter,
        time: 60_000,
      });

      switch (confirmation.customId) {
        case "powerOn":
          generator.powerOn();
          break;
        case "powerOff":
          generator.powerOff();
          break;
        case "addFuel":
          await generator.addFuel();
          break;
        case "upgradeLevel":
          await generator.upgradeLevel();
          break;
      }

      const { ui, row } = await generateUI(generator);
      await confirmation.update({
        embeds: [ui],
        components: [row],
        ephemeral: true,
      });
    } catch (error) {
      await interaction.deleteReply();
      break;
    }
  }
}

async function generateUI(generator) {
  const ui = new EmbedBuilder().setTitle("Generator").addFields(
    {
      name: "Generator status",
      value: `Generator level: ${generator.getLevel()}`,
      inline: true,
    },
    {
      name: "Power",
      value: generator.isPowered() ? "On" : "Off",
      inline: true,
    },
    { name: "\t", value: "\t" }, // Zero-width space to create space
    {
      name: "ETA",
      value: `${generator.getTimeLeft()} hours left`,
      inline: true,
    },
    {
      name: "Fuel level",
      value: `${await generator.getFuelLevel()}%`,
      inline: true,
    },
  );

  const bAddFuel = new ButtonBuilder()
    .setCustomId("addFuel")
    .setLabel("Add gas canister")
    .setStyle(ButtonStyle.Primary);

  const powerButtonId = generator.isPowered() ? "powerOff" : "powerOn";
  const powerButtonLabel = generator.isPowered() ? "Power Off" : "Power On";
  const powerButtonStyle = generator.isPowered()
    ? ButtonStyle.Danger
    : ButtonStyle.Success;
  const bPower = new ButtonBuilder()
    .setCustomId(powerButtonId)
    .setLabel(powerButtonLabel)
    .setStyle(powerButtonStyle);

  const bUpgrade = new ButtonBuilder()
    .setCustomId("upgradeLevel")
    .setLabel("Upgrade generator")
    .setStyle(ButtonStyle.Secondary);

  const row = new ActionRowBuilder().addComponents(bAddFuel, bPower, bUpgrade);

  return { ui, row };
}

export { commandData as data, execute };
