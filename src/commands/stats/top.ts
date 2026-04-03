import { ApplicationCommandOptionType } from "discord.js";

import { BaseCommand } from "#commands/baseCommand";
import { statsService } from "#repo/stats";
import { voiceService } from "#repo/voice";
import type { UserStatsKeys } from "#types/repo";
import { colors } from "#utils/color";

const formatCategoryName = (category: UserStatsKeys) => {
	switch (category) {
		case "messagesSent":
			return "количеству сообщений";
		case "commandsUsed":
			return "количеству вызванных команд";
		case "voiceTime":
			return "времени в голосовых каналах";
		case "reactionsUsed":
			return "количеству использованных реакций";
	}
};

const formatCategoryValue = (
	category: UserStatsKeys,
	value: number | bigint,
) => {
	switch (category) {
		case "messagesSent":
			return value;
		case "commandsUsed":
			return value;
		case "voiceTime":
			return voiceService.formatTime(value as bigint);
		case "reactionsUsed":
			return value;
	}
};

export const topCommand = new BaseCommand({
	name: "top",
	description: "Показать топ пользователей по категории",
	options: [
		{
			name: "category",
			description: "Категория статистики",
			type: ApplicationCommandOptionType.String,
			isRequired: true,
			choices: [
				{
					name: "voice",
					value: "voiceTime",
				},
				{
					name: "messages",
					value: "messagesSent",
				},
				{
					name: "commands",
					value: "commandsUsed",
				},
				{
					name: "reactions",
					value: "reactionsUsed",
				},
			],
		},
		{
			name: "ephemeral",
			description: "Показать всем",
			type: ApplicationCommandOptionType.Boolean,
			isRequired: false,
			defaultValue: false,
		},
	],
	run: async (ctx) => {
		const data = await statsService.getTopStats({
			type: ctx.options.category.value,
		});

		await ctx.interaction.reply({
			flags: ctx.options.ephemeral.value ? undefined : ["Ephemeral"],
			embeds: [
				{
					description:
						`Топ статистики по \`${formatCategoryName(ctx.options.category.value)}\`\n\n` +
						data
							.map(
								(stats) =>
									`<@${stats.user.discordId}>: \`${formatCategoryValue(ctx.options.category.value, stats[ctx.options.category.value])}\``,
							)
							.join("\n"),
					color: colors.success,
				},
			],
			allowedMentions: {
				users: data.map((stats) => stats.user.discordId),
			},
		});
	},
});
