import { client } from "#src/client";
import { Logger } from "#utils/logger";

const logger = new Logger("EVENTS:clientReady");

client.once("clientReady", () => {
	logger.info(`Logged in as ${client.user?.tag}`);
});
