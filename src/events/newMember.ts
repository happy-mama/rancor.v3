import { client } from "#src/client";
import userService from "#repo/user";

class NewMemberEvents {
    constructor() {
        client.on("guildMemberAdd", (member) => {
            userService.createUser({
                discordId: member.user.id,
                username: member.user.username,
            });
        });
    }
}

export const newMemberEvents = new NewMemberEvents();
