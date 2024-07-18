import { SlashCommandBuilder } from "discord.js";
import PlayerGraphConfigManager from "../../managers/playerGraph/PlayerGraphConfigManager.js";

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
    subcommand.setName("setrole").setDescription("Sets the role for notifications"),
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
  // TODO: get role
  const configs = PlayerGraphConfigManager.getInstance();
  const config = await configs.get(interaction.guildId);
  config.setRole(roleId);
}

async function clearRole(interaction) {
  // TODO: get role
  const configs = PlayerGraphConfigManager.getInstance();
  const config = await configs.get(interaction.guildId);
  config.setRole(null);
}

async function execute(interaction) {
  switch (interaction.options.getSubcommand()) {
    case "setchannel":
      setChannel(interaction);
      break;
    case "clearchannel":
      clearChannel();
    case "setrole":
      setRole();
    case "clearrole":
      clearRole();
  }
}

export { data, execute };
