import { ApplicationCommandOptionType, ChannelType } from "discord.js";

import { BaseCommand } from "../baseCommand";

const MAX_CYCLES = 10;
const FETCH_LIMIT = 100;

export const clearCommand = new BaseCommand({
	name: "clear",
	description: "Удалить последние X сообщений в чате",
	options: [
		{
			name: "amount",
			description: "Количество сообщений",
			type: ApplicationCommandOptionType.Integer,
			isRequired: true,
		},
		{
			name: "user",
			description: "Юзер, сообщения которого нужно удалить",
			type: ApplicationCommandOptionType.User,
			isRequired: false,
		},
	],
	permissions: ["ManageMessages"],
	run: async (ctx) => {
		if (!ctx.interaction.channel) {
			ctx.meta.tags.push("no_channel");
			return;
		}

		if (ctx.interaction.channel.type !== ChannelType.GuildText) {
			ctx.meta.tags.push("channel_is_not_type_of_GuildText");
			return;
		}

		if (ctx.options.amount.value > 100) {
			await ctx.interaction.reply({
				flags: ["Ephemeral"],
				content: "Нельзя удалить больше `100` сообщений за раз",
			});

			ctx.meta.tags.push("amount_more_100");
			return;
		}

		if (ctx.options.amount.value < 1) {
			await ctx.interaction.reply({
				flags: ["Ephemeral"],
				content: "Нельзя удалить меньше `1` сообщения за раз",
			});

			ctx.meta.tags.push("amount_less_1");
			return;
		}

		if (ctx.options.user?.user) {
			await ctx.interaction.deferReply({ flags: ["Ephemeral"] });

			const target = ctx.options.user.user;

			let cycle = 0;
			let toDelete = ctx.options.amount.value;
			let before = "";

			while (cycle < MAX_CYCLES && toDelete > 0) {
				try {
					const messages = await ctx.interaction.channel.messages.fetch({
						limit: FETCH_LIMIT,
						...{ before: before ? before : undefined },
					});

					const filtered = messages
						.filter((m) => m.author.id === target.id)
						.toJSON()
						.slice(0, toDelete);

					before = messages.at(-1)?.id ?? "";

					if (filtered.length !== 0) {
						await ctx.interaction.channel.bulkDelete(filtered, true);
					}

					toDelete -= filtered.length;
					cycle++;

					ctx.meta.tags.push(`cycle_${cycle}`);
				} catch (error) {
					ctx.meta.tags.push("ERROR");
					ctx.logger.error(error);
					break;
				}
			}

			if (cycle >= 10 && toDelete > 0) {
				await ctx.interaction.editReply({
					content: `Удалено \`${ctx.options.amount.value - toDelete}\` сообщений, остальные не найдены за последние ${MAX_CYCLES * FETCH_LIMIT} сообщений`,
				});
			} else {
				ctx.interaction.editReply({
					content: "Готово",
				});
			}
		} else {
			await ctx.interaction.channel.bulkDelete(ctx.options.amount.value, true);

			await ctx.interaction.reply({
				flags: ["Ephemeral"],
				content: "Готово",
			});
		}

		ctx.meta.tags.push(`deleted_${ctx.options.amount.value}_messages`);
	},
});
