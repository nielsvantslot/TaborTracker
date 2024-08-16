import { SlashCommandBuilder } from "discord.js";
import PlayerGraphConfigManager from "../../managers/playerGraph/PlayerGraphConfigManager.js";
import Discord from "../../discord.js";

const data = new SlashCommandBuilder()
  .setName("playergraph")
  .setDescription("Manages the playergraph configuration")
  .addSubcommand((subcommand) =>
    subcommand.setName("setchannel").setDescription("Displays the live player count in the current channel"),
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("clearchannel").setDescription("Removes the live player count from the guild"),
  )
  .addSubcommand((subcommand) =>
      subcommand
        .setName("setrole").setDescription("Sets the role for notifications")
        .addRoleOption(option =>
          option
            .setName("pingrole")
            .setDescription("The role that will be used for updates.")
            .setRequired(true)
        )
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("clearrole").setDescription("Clears the role for notifications"),
  )

async function setChannel(interaction) {
  const configs = PlayerGraphConfigManager.getInstance();
  await configs.addOrUpdate(interaction.guildId, interaction.channelId);
  interaction.reply({
    content: "The channel has been set",
    ephemeral: true,
  });
}

async function clearChannel(interaction) {
  const configs = PlayerGraphConfigManager.getInstance();
  const config = await configs.get(interaction.guildId);
  if (!config) {
    return interaction.reply({
      content: "There is no configuration for this guild yet.",
      ephemeral: true,
    });
  }
  await configs.delete(config.getGuildId());

  const channel = Discord.getClient().channels.cache.get(config.getChannelId());
  const message = await channel.messages.fetch(config.getMessageId());
  await message.delete();

  interaction.reply({
    content: "The channel has been cleared",
    ephemeral: true,
  });
}

async function setRole(interaction) {
  const role = interaction.options.getRole("pingrole");
  const configs = PlayerGraphConfigManager.getInstance();
  const config = await configs.get(interaction.guildId);
  if (!config) {
    return interaction.reply({
      content: "There is no configuration for this guild yet.",
      ephemeral: true,
    });
  }
  config.setRoleId(role.id);

  interaction.reply({
    content: "The role has been set",
    ephemeral: true,
  });
}

async function clearRole(interaction) {
  const configs = PlayerGraphConfigManager.getInstance();
  const config = await configs.get(interaction.guildId);
  if (!config) {
    return interaction.reply({
      content: "There is no configuration for this guild yet.",
      ephemeral: true,
    });
  }
  config.setRoleId(null);

  interaction.reply({
    content: "The role has been removed",
    ephemeral: true,
  });
}

async function execute(interaction) {
  switch (interaction.options.getSubcommand()) {
    case "setchannel":
      setChannel(interaction);
      break;
    case "clearchannel":
      clearChannel(interaction);
      break;
    case "setrole":
      setRole(interaction);
      break;
    case "clearrole":
      clearRole(interaction);
      break;
  }
}

export { data, execute };
