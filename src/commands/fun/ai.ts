import { ApplicationCommandOptionType } from "discord.js";
import { BaseCommand } from "#commands/baseCommand";
import { aiClient } from "#lib/ai";
import { colors } from "#utils/color";

export const AICommand = new BaseCommand({
	name: "ai",
	description: "Задать ИИ любой вопрос (gemini-2.5-flash-lite)",
	options: [
		{
			name: "prompt",
			description: "Введите ваш вопрос",
			type: ApplicationCommandOptionType.String,
			isRequired: true,
		},
		{
			name: "ephemeral",
			description: "Показать результат всем",
			type: ApplicationCommandOptionType.Boolean,
			isRequired: false,
		},
	],
	run: async (ctx) => {
		const prompt = ctx.options.prompt.value.trim();

		if (prompt.length < 10) {
			await ctx.interaction.reply("Минимальная длина вопроса - 10 символов.");
			return;
		}

		if (prompt.length >= 256) {
			await ctx.interaction.reply("Максимальная длина вопроса - 256 символов.");
			return;
		}

		await ctx.interaction.deferReply({
			flags:
				(ctx.options.ephemeral?.value ?? false) ? undefined : ["Ephemeral"],
		});

		let result = await aiClient.generateContent(prompt);

		const parts: string[] = [];

		while (result.length > 0) {
			parts.push(result.slice(0, 1900));
			result = result.slice(1900);
		}

		await ctx.interaction.editReply({
			embeds: [
				{
					title: `**Q:** ${prompt}`,
					description: `**A:** ${parts[0]}`,
					color: colors.success,
				},
			],
		});

		if (parts.length > 1) {
			let ignoreFirst = true;

			for (const part of parts) {
				if (ignoreFirst) {
					ignoreFirst = false;
					continue;
				}

				await ctx.interaction.followUp({
					flags:
						(ctx.options.ephemeral?.value ?? false) ? undefined : ["Ephemeral"],
					embeds: [
						{
							description: part,
							color: colors.success,
						},
					],
				});
			}
		}
	},
});
