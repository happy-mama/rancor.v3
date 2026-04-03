import { userService } from "#repo/user";
import { client } from "#src/client";

client.on("guildMemberAdd", (member) => {
	userService.createUser({
		discordId: member.user.id,
		username: member.user.username,
	});
});
