import { ApplicationCommandOptionType } from "discord.js";

import { BaseCommand } from "#commands/baseCommand";
import { VoiceSessionState } from "#generated/prisma/enums";
import { statsService } from "#repo/stats";
import { voiceService } from "#repo/voice";
import { colors } from "#utils/color";

export const statsCommand = new BaseCommand({
	name: "stats",
	description: "Узнать статистику пользователя",
	options: [
		{
			name: "user",
			description: "Пользователь, статистику которого хотите узнать",
			type: ApplicationCommandOptionType.User,
			isRequired: false,
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
		const target = ctx.options.user?.user ?? ctx.interaction.user;

		const stats = await statsService.getStats(target.id);

		if (!stats) {
			ctx.meta.tags.push("stats_not_found");
			return ctx.interaction.reply({ content: "Статистика не найдена" });
		}

		const voice = await voiceService.getTime(target.id);
		let lastSession = "отсутствует";

		if (voice.session) {
			if (voice.session.state === VoiceSessionState.ACTIVE) {
				lastSession = "сейчас";
			} else {
				lastSession = `<t:${Math.floor(voice.session.endTime.getTime() / 1000)}:R>`;
			}
		}

		return ctx.interaction.reply({
			flags: ctx.options.ephemeral.value ? undefined : ["Ephemeral"],
			embeds: [
				{
					description:
						`**Статистика юзера:** <@${target.id}>\n\n` +
						`**Время в войсе**: \`${voice.time}\`\n` +
						`**Последняя сессия в войсе:** ${lastSession}\n` +
						`**Сообщений**: ${stats.messagesSent}\n` +
						`**Команд**: ${stats.commandsUsed}\n` +
						`**Реакций**: ${stats.reactionsUsed}`,
					color: colors.success,
				},
			],
			allowedMentions: {
				users: [target.id],
			},
		});
	},
});
