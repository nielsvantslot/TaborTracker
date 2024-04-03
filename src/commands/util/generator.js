import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import generatorManager from "../../managers/GeneratorManager.js";

const data = new SlashCommandBuilder()
  .setName("generator")
  .setDescription("Manage your generator.");

const execute = async (interaction) => {
  const generator = generatorManager.getByUserId(interaction.user.id);
  const { ui, row } = generateUi(interaction.user.id);

  const response = await interaction.reply({
    embeds: [ui],
    components: [row],
    ephemeral: true,
  });

  const collectorFilter = (i) => i.user.id === interaction.user.id;
  const handleConfirmation = async () => {
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
          generator.addFuel();
          break;
        case "upgradeLevel":
          generator.upgradeLevel();
          break;
      }

      const { ui, row } = generateUi(interaction.user.id);
      await confirmation.update({
        embeds: [ui],
        components: [row],
        ephemeral: true,
      });

      await handleConfirmation();
    } catch (e) {
      await interaction.deleteReply();
    }
  };

  await handleConfirmation();
};

function generateUi(uid) {
  const generator = generatorManager.getByUserId(uid);

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
    {
      name: "\t",
      value: "\t",
    },
    {
      name: "ETA",
      value: `${generator.getTimeLeft()} hours left`,
      inline: true,
    },
    {
      name: "Fuel level",
      value: `${generator.getFuelLevel()}%`,
      inline: true,
    },
  );

  const bAddFuel = new ButtonBuilder()
    .setCustomId("addFuel")
    .setLabel("Add gas canister")
    .setStyle(ButtonStyle.Primary);

  let bPower;
  if (generator.isPowered()) {
    bPower = new ButtonBuilder()
      .setCustomId("powerOff")
      .setLabel("power off")
      .setStyle(ButtonStyle.Danger);
  } else {
    bPower = new ButtonBuilder()
      .setCustomId("powerOn")
      .setLabel("power on")
      .setStyle(ButtonStyle.Success);
  }

  const bUpgrade = new ButtonBuilder()
    .setCustomId("upgradeLevel")
    .setLabel("Upgrade generator")
    .setStyle(ButtonStyle.Secondary);

  const row = new ActionRowBuilder().addComponents(bAddFuel, bPower, bUpgrade);

  return { ui, row };
}

export { data, execute };
