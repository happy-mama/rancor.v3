import { type ChatInputCommandInteraction } from "discord.js";

import type {
    CommandRun,
    CommandContextMeta,
    CommandMeta,
    CommandOption,
    ResolveOptions,
    CommandContext,
} from "#types/command";

import { client } from "#src/client";
import { config } from "#utils/config";
import { Logger } from "#utils/logger";

const CLEAR_COMMAND_CONTEXT_META: CommandContextMeta = {
    timeStart: 0,
    timeEnd: 0,
    timeNow: 0,
    tags: [],
};

export class BaseCommand<
    const CommandOptions extends CommandOption[] = CommandOption[],
> {
    public readonly name: CommandMeta["name"];
    public readonly description: CommandMeta["description"];
    public readonly options: CommandOptions;
    private readonly run: CommandRun<CommandOptions>;

    public readonly logger: Logger;

    constructor(props: {
        name: CommandMeta["name"];
        description: CommandMeta["description"];
        options: CommandOptions;
        run: CommandRun<CommandOptions>;
    }) {
        this.logger = new Logger(`COMMAND:${props.name}`);

        this.name = props.name;
        this.description = props.description;
        this.options = props.options;
        this.run = props.run;
    }

    private createContext(
        interaction: ChatInputCommandInteraction,
    ): CommandContext<CommandOptions> {
        const meta = structuredClone(CLEAR_COMMAND_CONTEXT_META);

        meta.timeStart = Date.now();

        const options = {} as ResolveOptions<CommandOptions>;

        for (const option of interaction.options.data) {
            const name = option.name as CommandOptions[number]["name"];

            options[name] = option as any;
        }

        return {
            client,
            config,
            meta,
            interaction,
            options: options as ResolveOptions<CommandOptions>,
        };
    }

    public async execute(interaction: ChatInputCommandInteraction) {
        let ctx = this.createContext(interaction);

        try {
            await this.run(ctx);
        } catch (error) {
            console.error(error);
        }

        ctx.meta.timeEnd = Date.now();

        this.logger.debug(
            `executed in ${ctx.meta.timeEnd - ctx.meta.timeStart}ms, tags: ${ctx.meta.tags.join(", ")}`,
        );
    }
}
