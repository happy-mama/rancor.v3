import { ApplicationCommandOptionType } from "discord.js";

import { BaseCommand } from "#commands/baseCommand";
import statsService from "#repo/stats";
import { voiceService } from "#repo/voice";

const formatCategoryName = (
    category: "messagesSent" | "commandsUsed" | "voiceTime",
) => {
    switch (category) {
        case "messagesSent":
            return "количеству сообщений";
        case "commandsUsed":
            return "количеству вызванных команд";
        case "voiceTime":
            return "времени в голосовых каналах";
    }
};

const formatCategoryValue = (
    category: "messagesSent" | "commandsUsed" | "voiceTime",
    value: number | bigint,
) => {
    switch (category) {
        case "messagesSent":
            return value;
        case "commandsUsed":
            return value;
        case "voiceTime":
            return voiceService.formatTime(value as bigint);
    }
};

export const topCommand = new BaseCommand({
    name: "top",
    description: "Узнать статистику пользователя",
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
            ],
        },
        {
            name: "ephemeral",
            description: "Показать всем",
            type: ApplicationCommandOptionType.Boolean,
            isRequired: false,
        },
    ],
    run: async (ctx) => {
        const data = await statsService.getTopStats({
            type: ctx.options.category.value,
        });

        ctx.interaction.reply({
            flags:
                (ctx.options.ephemeral?.value ?? false)
                    ? undefined
                    : ["Ephemeral"],
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
                    color: 13748767,
                },
            ],
            allowedMentions: {
                users: data.map((stats) => stats.user.discordId),
            },
        });
    },
});
