import { client } from "#src/client";
import statsService from "#src/repo/stats";

class MessagesEvents {
    constructor() {
        client.on("messageCreate", (message) => {
            statsService.updateStats({
                discordId: message.author.id,
                type: "messagesSent",
                value: 1,
            });
        });
    }
}

export const messagesEvents = new MessagesEvents();
