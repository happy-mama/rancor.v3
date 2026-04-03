import { client } from "#src/client";
import { statsService } from "#src/repo/stats";

client.on("messageCreate", (message) => {
	if (message.author.bot) return;

	statsService.updateStats({
		discordId: message.author.id,
		type: "messagesSent",
		value: 1,
	});
});
