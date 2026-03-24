import {
    ApplicationCommandOptionType,
    Attachment,
    ChatInputCommandInteraction,
    Client,
    Role,
    TextChannel,
    User,
    VoiceChannel,
} from "discord.js";
import { config as configType } from "#utils/config";
import { CategoryChannel, GuildMember } from "node_modules/discord.js/typings";

export interface CommandMeta {
    name: string;
    description: string;
}

export type CommandRun<T extends CommandOption[]> = (
    ctx: CommandContext<T>,
) => Promise<void>;

export interface CommandContextMeta {
    timeStart: number;
    timeEnd: number;
    tags: string[];
    [key: string | number]: any;
}

export interface CommandContext<CommandOptions extends CommandOption[]> {
    client: Client;
    config: typeof configType;
    meta: CommandContextMeta;
    interaction: ChatInputCommandInteraction;
    options: ResolveOptions<CommandOptions>;
}

export interface CommandOption {
    name: string;
    description: string;
    isRequired?: boolean;
    type: ApplicationCommandOptionType;
}

export type ResolveOptions<Options extends CommandOption[]> = {
    [K in Options[number] as K["name"]]: K["isRequired"] extends true
        ? CommandInteractionOptions[Extract<
              K["type"],
              keyof CommandInteractionOptions
          >]
        :
              | CommandInteractionOptions[Extract<
                    K["type"],
                    keyof CommandInteractionOptions
                >]
              | undefined;
};

export interface CommandInteractionOptions {
    [ApplicationCommandOptionType.User]: {
        name: string;
        type: ApplicationCommandOptionType.User;
        value: string;
        user: User;
        member: GuildMember;
    };
    [ApplicationCommandOptionType.Boolean]: {
        name: string;
        type: ApplicationCommandOptionType.Boolean;
        value: boolean;
    };
    [ApplicationCommandOptionType.Integer]: {
        name: string;
        type: ApplicationCommandOptionType.Integer;
        value: number;
    };
    [ApplicationCommandOptionType.String]: {
        name: string;
        type: ApplicationCommandOptionType.String;
        value: string;
    };
    [ApplicationCommandOptionType.Number]: {
        name: string;
        type: ApplicationCommandOptionType.Number;
        value: number;
    };
    [ApplicationCommandOptionType.Attachment]: {
        name: string;
        type: ApplicationCommandOptionType.Attachment;
        value: string;
        attachment: Attachment;
    };
    [ApplicationCommandOptionType.Channel]: {
        name: string;
        type: ApplicationCommandOptionType.Channel;
        value: string;
        channel: TextChannel | VoiceChannel | CategoryChannel;
    };
    [ApplicationCommandOptionType.Role]: {
        name: string;
        type: ApplicationCommandOptionType.Role;
        value: string;
        role: Role;
    };
    [ApplicationCommandOptionType.Mentionable]: {
        name: string;
        type: ApplicationCommandOptionType.Mentionable;
        value: string;
        user?: User;
        member?: GuildMember;
        role?: Role;
    };
}
