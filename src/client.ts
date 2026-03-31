import { Client, GatewayIntentBits, Partials } from "discord.js";

import { config } from "#utils/config";

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
	],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

export const startClient = async () => {
	return await client.login(config.get("DISCORD_BOT_TOKEN"));
};
