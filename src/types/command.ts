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
import { CategoryChannel, GuildMember } from "node_modules/discord.js/typings";

import { config as configType } from "#utils/config";
import { Logger } from "#utils/logger";

export interface CommandMeta {
    name: string;
    description: string;
}

export type CommandRun<T extends CommandOption[]> = (
    ctx: CommandContext<T>,
) => Promise<unknown>;

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
    logger: Logger;
}

type CommandOptionChoice<T extends ApplicationCommandOptionType> = {
    name: string;
    value: T extends ApplicationCommandOptionType.Integer ? number : string;
};

type CommandOptionBase<Type extends ApplicationCommandOptionType> = {
    name: string;
    description: string;
    isRequired?: boolean;
    type: Type;
};

type ChoiceAllowed =
    | ApplicationCommandOptionType.String
    | ApplicationCommandOptionType.Integer;

export type CommandOption =
    | (CommandOptionBase<ApplicationCommandOptionType.String> & {
          choices?: CommandOptionChoice<ApplicationCommandOptionType.String>[];
      })
    | (CommandOptionBase<ApplicationCommandOptionType.Integer> & {
          choices?: CommandOptionChoice<ApplicationCommandOptionType.Integer>[];
      })
    | (CommandOptionBase<
          Exclude<ApplicationCommandOptionType, ChoiceAllowed>
      > & {
          choices?: never;
      });

type ExtractChoiceValues<T> = T extends { choices: readonly (infer C)[] }
    ? C extends { value: infer V }
        ? V
        : never
    : never;

type ResolveValue<K extends CommandOption> = K extends {
    choices: readonly any[];
}
    ? ExtractChoiceValues<K>
    : CommandInteractionOptions[Extract<
          K["type"],
          keyof CommandInteractionOptions
      >]["value"];

export type ResolveOptions<Options extends CommandOption[]> = {
    [K in Options[number] as K["name"]]: K["isRequired"] extends true
        ? Omit<
              CommandInteractionOptions[Extract<
                  K["type"],
                  keyof CommandInteractionOptions
              >],
              "value"
          > & {
              value: ResolveValue<K>;
          }
        :
              | (Omit<
                    CommandInteractionOptions[Extract<
                        K["type"],
                        keyof CommandInteractionOptions
                    >],
                    "value"
                > & {
                    value: ResolveValue<K>;
                })
              | undefined;
};

// export type ResolveOptions<Options extends CommandOption[]> = {
//     [K in Options[number] as K["name"]]: K["isRequired"] extends true
//         ? CommandInteractionOptions[Extract<
//               K["type"],
//               keyof CommandInteractionOptions
//           >]
//         :
//               | CommandInteractionOptions[Extract<
//                     K["type"],
//                     keyof CommandInteractionOptions
//                 >]
//               | undefined;
// };

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
