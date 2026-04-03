import { statsService } from "#repo/stats";
import { client } from "#src/client";
import { Logger } from "#utils/logger";

const logger = new Logger("EVENT:reaction");

client.on("messageReactionAdd", async (reaction, user) => {
	if (user.bot) return;

	statsService.updateStats({
		discordId: user.id,
		type: "reactionsUsed",
		value: 1,
	});

	logger.debug(`user ${user.tag} added reaction ${reaction.emoji.name}`);
});
