import dotenv from "dotenv";

const environment = (process.env.NODE_ENV || "development").trim();
const envFile = environment === "production" ? ".env.prod" : ".env";

dotenv.config({ path: envFile });
dotenv.config();

console.log(`Using ${envFile} for environment: ${environment}`);

export const channelId = process.env.CHANNEL_ID;
export const refreshRate = parseInt(process.env.REFRESH_RATE + "000");
export const roleId = process.env.ROLE_ID;
export const graphLength = parseInt(process.env.GRAPH_LENGTH);
export const url = process.env.URL;
export const clientId = process.env.CLIENT_ID;
export const guildId = process.env.GUILD_ID;
export const discordToken = process.env.DISCORD_TOKEN;
