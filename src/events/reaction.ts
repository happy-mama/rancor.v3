import { client } from "#src/client";
import statsService from "#repo/stats";
import { Logger } from "#utils/logger";

class ReactionEvents {
    private logger = new Logger("EVENT:reaction");

    constructor() {
        client.on("messageReactionAdd", async (reaction, user) => {
            if (user.bot) return;

            statsService.updateStats({
                discordId: user.id,
                type: "reactionsUsed",
                value: 1,
            });

            this.logger.debug(
                `user ${user.tag} added reaction ${reaction.emoji.name}`,
            );
        });
    }
}

export const reactionEvents = new ReactionEvents();
