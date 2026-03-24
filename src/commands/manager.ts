import {
    ApplicationCommandOptionType,
    REST,
    Routes,
    SlashCommandBuilder,
} from "discord.js";

import type { BaseCommand } from "#commands/baseCommand";
import { Logger } from "#utils/logger";
import { config } from "#utils/config";
import * as allCommands from "#commands/index";

class CommandManager {
    private commands: { [key: string]: BaseCommand } = {};
    public logger = new Logger("COMMAND_MANAGER");

    constructor() {
        for (const category of Object.values(allCommands)) {
            for (const command of Object.values(category)) {
                this.register(command);
            }
        }
    }

    public register(command: BaseCommand) {
        this.commands[command.name] = command;

        this.logger.info(`Registered command: ${command.name}`);
    }

    public get(name: string) {
        return this.commands[name] || null;
    }

    public async generate() {
        const slashCommands = Object.values(this.commands).map((command) =>
            this.buildSlashCommand(command),
        );

        const rest = new REST({ version: "10" }).setToken(
            config.get("DISCORD_BOT_TOKEN"),
        );

        try {
            this.logger.info("Uploading commands...");

            await rest.put(
                Routes.applicationCommands(
                    config.get("DISCORD_APPLICATION_ID"),
                ),
                { body: slashCommands },
            );

            this.logger.info("Commands uploaded");
        } catch (error) {
            this.logger.error(error);
        }
    }

    private buildSlashCommand(command: BaseCommand) {
        const slashCommand = new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description);

        for (const option of command.options) {
            switch (option.type) {
                case ApplicationCommandOptionType.User: {
                    slashCommand.addUserOption((builder) =>
                        builder
                            .setName(option.name)
                            .setDescription(option.description)
                            .setRequired(option.isRequired ?? false),
                    );
                    break;
                }
                case ApplicationCommandOptionType.Role: {
                    slashCommand.addRoleOption((builder) =>
                        builder
                            .setName(option.name)
                            .setDescription(option.description)
                            .setRequired(option.isRequired ?? false),
                    );
                    break;
                }
                case ApplicationCommandOptionType.Channel: {
                    slashCommand.addChannelOption((builder) =>
                        builder
                            .setName(option.name)
                            .setDescription(option.description)
                            .setRequired(option.isRequired ?? false),
                    );
                    break;
                }
                case ApplicationCommandOptionType.String: {
                    slashCommand.addStringOption((builder) =>
                        builder
                            .setName(option.name)
                            .setDescription(option.description)
                            .setRequired(option.isRequired ?? false),
                    );
                    break;
                }
                case ApplicationCommandOptionType.Number: {
                    slashCommand.addNumberOption((builder) =>
                        builder
                            .setName(option.name)
                            .setDescription(option.description)
                            .setRequired(option.isRequired ?? false),
                    );
                    break;
                }
                case ApplicationCommandOptionType.Boolean: {
                    slashCommand.addBooleanOption((builder) =>
                        builder
                            .setName(option.name)
                            .setDescription(option.description)
                            .setRequired(option.isRequired ?? false),
                    );
                    break;
                }
                case ApplicationCommandOptionType.Integer: {
                    slashCommand.addIntegerOption((builder) =>
                        builder
                            .setName(option.name)
                            .setDescription(option.description)
                            .setRequired(option.isRequired ?? false),
                    );
                    break;
                }
                case ApplicationCommandOptionType.Attachment: {
                    slashCommand.addAttachmentOption((builder) =>
                        builder
                            .setName(option.name)
                            .setDescription(option.description)
                            .setRequired(option.isRequired ?? false),
                    );
                    break;
                }
                case ApplicationCommandOptionType.Mentionable: {
                    slashCommand.addMentionableOption((builder) =>
                        builder
                            .setName(option.name)
                            .setDescription(option.description)
                            .setRequired(option.isRequired ?? false),
                    );
                    break;
                }
            }
        }

        return slashCommand.toJSON();
    }
}

export const commandManager = new CommandManager();
