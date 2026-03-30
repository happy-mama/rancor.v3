import { ApplicationCommandOptionType } from "discord.js";
import { BaseCommand } from "#commands/baseCommand";
import { geminiClient } from "#src/lib/gemini";
import { colors } from "#utils/color";

export const AICommand = new BaseCommand({
    name: "ai",
    description: "Ask the AI a question",
    options: [
        {
            name: "prompt",
            description: "The prompt to send to the AI",
            type: ApplicationCommandOptionType.String,
            isRequired: true,
        },
        {
            name: "ephemeral",
            description: "Whether the response should be ephemeral",
            type: ApplicationCommandOptionType.Boolean,
            isRequired: false,
        },
    ],
    run: async (ctx) => {
        const prompt = ctx.options.prompt.value;

        if (prompt.length < 6) {
            await ctx.interaction.reply(
                "Please provide a prompt with at least 6 characters.",
            );
            return;
        }

        await ctx.interaction.deferReply({
            flags:
                (ctx.options.ephemeral?.value ?? false)
                    ? undefined
                    : ["Ephemeral"],
        });

        let result = await geminiClient.generateContent(prompt);

        let parts: string[] = [];

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
                        (ctx.options.ephemeral?.value ?? false)
                            ? undefined
                            : ["Ephemeral"],
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
