import type { ChatInputCommandInteraction } from "discord.js";
import { statsService } from "#repo/stats";

import { client } from "#src/client";
import type {
	CommandContext,
	CommandContextMeta,
	CommandMeta,
	CommandOption,
	CommandRun,
	ResolveOptions,
} from "#types/command";
import { config } from "#utils/config";
import { Logger } from "#utils/logger";

const COMMAND_TIMEOUT = 40_000;

const CLEAR_COMMAND_CONTEXT_META: CommandContextMeta = {
	timeStart: 0,
	timeEnd: 0,
	tags: [],
};

export class BaseCommand<
	const CommandOptions extends CommandOption[] = CommandOption[],
> {
	public readonly name: CommandMeta["name"];
	public readonly description: CommandMeta["description"];
	public readonly options: CommandOptions;
	public readonly permissions: CommandMeta["permissions"];
	private readonly run: CommandRun<CommandOptions>;

	public readonly logger: Logger;

	constructor(props: {
		name: CommandMeta["name"];
		description: CommandMeta["description"];
		options: CommandOptions;
		run: CommandRun<CommandOptions>;
		permissions?: CommandMeta["permissions"];
	}) {
		this.logger = new Logger(`COMMAND:${props.name}`);

		this.name = props.name;
		this.description = props.description;
		this.options = props.options;
		this.permissions = props.permissions ?? [];
		this.run = props.run;
	}

	private createContext(
		interaction: ChatInputCommandInteraction,
	): CommandContext<CommandOptions> {
		const meta = structuredClone(CLEAR_COMMAND_CONTEXT_META);

		meta.timeStart = Date.now();

		const options = {} as ResolveOptions<CommandOptions>;

		for (const option of this.options) {
			const name = option.name as CommandOptions[number]["name"];
			const found = interaction.options.data.find((o) => o.name === name);

			if (found) {
				options[name] = found as any;
			} else if (option.defaultValue !== undefined) {
				options[name] = {
					name,
					type: option.type,
					value: option.defaultValue,
				} as any;
			}
		}

		return {
			client,
			config,
			meta,
			interaction,
			options: options as ResolveOptions<CommandOptions>,
			logger: this.logger,
		};
	}

	private timeoutPromise(ctx: CommandContext<CommandOptions>) {
		let timeout: NodeJS.Timeout | undefined;

		const timeoutPromise = new Promise((_, reject) => {
			timeout = setTimeout(async () => {
				if (ctx.interaction.deferred) {
					await ctx.interaction.editReply("Таймаут команды, попробуйте снова");
				}

				reject(new Error("timed out"));
			}, COMMAND_TIMEOUT);
		});

		return { timeoutPromise, timeout };
	}

	public async execute(interaction: ChatInputCommandInteraction) {
		const ctx = this.createContext(interaction);

		const { timeoutPromise, timeout } = this.timeoutPromise(ctx);

		try {
			await statsService.incrementStatsCommandsUsed(ctx.interaction.user.id);

			await Promise.race([this.run(ctx), timeoutPromise]);

			clearTimeout(timeout);
			ctx.meta.timeEnd = Date.now();

			this.logger.debug(
				`executed in ${ctx.meta.timeEnd - ctx.meta.timeStart}ms, tags: ${ctx.meta.tags.join(", ")}`,
			);
		} catch (error) {
			clearTimeout(timeout);
			ctx.meta.timeEnd = Date.now();

			this.logger.error(
				`executed in ${ctx.meta.timeEnd - ctx.meta.timeStart}ms, tags: ${ctx.meta.tags.join(", ")}`,
				error,
			);
		}
	}
}
