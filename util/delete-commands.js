import { REST, Routes } from "discord.js";
import { clientId, guildId, discordToken } from "./constants.js";

const rest = new REST().setToken(discordToken);

// for guild-based commands
rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
  .then(() =>
    console.log(
      "\x1b[32m%s\x1b[0m",
      "Successfully deleted all guild commands.",
    ),
  )
  .catch(console.error);

// for global commands
rest
  .put(Routes.applicationCommands(clientId), { body: [] })
  .then(() =>
    console.log(
      "\x1b[32m%s\x1b[0m",
      "Successfully deleted all application commands.",
    ),
  )
  .catch(console.error);
