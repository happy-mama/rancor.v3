import { commandManager } from "#commands/manager";
import { client } from "#src/client";

client.on("interactionCreate", (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = commandManager.get(interaction.commandName);

	if (!command) return;

	command.execute(interaction);
});
