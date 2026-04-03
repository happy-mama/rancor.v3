import { ApplicationCommandOptionType } from "discord.js";
import { BaseCommand } from "#commands/baseCommand";
import { aiClient } from "#lib/ai";
import { colors } from "#utils/color";

const RATE_LIMIT_MS = 5000;
const userCooldowns = new Map<string, number>();

const cleanupCooldowns = () => {
	const now = Date.now();
	for (const [userId, timestamp] of userCooldowns) {
		if (now - timestamp > RATE_LIMIT_MS) {
			userCooldowns.delete(userId);
		}
	}
};

setInterval(cleanupCooldowns, RATE_LIMIT_MS * 2);

export const aiCommand = new BaseCommand({
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
			defaultValue: false,
		},
	],
	run: async (ctx) => {
		const userId = ctx.interaction.user.id;
		const now = Date.now();
		const lastUsed = userCooldowns.get(userId);

		if (lastUsed && now - lastUsed < RATE_LIMIT_MS) {
			const remaining = Math.ceil((RATE_LIMIT_MS - (now - lastUsed)) / 1000);
			return await ctx.interaction.reply({
				flags: ["Ephemeral"],
				content: `Подожди ещё ${remaining} сек.`,
			});
		}

		const prompt = ctx.options.prompt.value.trim();

		if (prompt.length < 10) {
			return await ctx.interaction.reply(
				"Минимальная длина вопроса - 10 символов.",
			);
		}

		if (prompt.length >= 256) {
			return await ctx.interaction.reply(
				"Максимальная длина вопроса - 256 символов.",
			);
		}

		userCooldowns.set(userId, now);

		await ctx.interaction.deferReply({
			flags: ctx.options.ephemeral.value ? undefined : ["Ephemeral"],
		});

		const result = await aiClient.generateContent(prompt);

		const parts: string[] = [];
		let remaining_text = result;

		while (remaining_text.length > 0) {
			parts.push(remaining_text.slice(0, 1900));
			remaining_text = remaining_text.slice(1900);
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
			for (let i = 1; i < parts.length; i++) {
				await ctx.interaction.followUp({
					flags: ctx.options.ephemeral.value ? undefined : ["Ephemeral"],
					embeds: [
						{
							description: parts[i],
							color: colors.success,
						},
					],
				});
			}
		}
	},
});
