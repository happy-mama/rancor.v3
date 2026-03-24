import { Client, GatewayIntentBits } from "discord.js";

import { config } from "#utils/config";

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
    ],
});

export const startClient = async () => {
    return await client.login(config.get("DISCORD_BOT_TOKEN"));
};
