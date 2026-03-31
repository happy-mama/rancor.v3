import { commandManager } from "#commands/manager";
import { client } from "#src/client";

class InteractionEvents {
	constructor() {
		client.on("interactionCreate", (interaction) => {
			if (!interaction.isChatInputCommand()) return;

			const command = commandManager.get(interaction.commandName);

			if (!command) return;

			command.execute(interaction);
		});
	}
}

export const interactionEvents = new InteractionEvents();
