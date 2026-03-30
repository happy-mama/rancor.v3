import { ApplicationCommandOptionType } from "discord.js";

import { BaseCommand } from "#commands/baseCommand";
import { statsService } from "#repo/stats";
import { voiceService } from "#repo/voice";
import { VoiceSessionState } from "#generated/prisma/enums";
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
            if (voice.session.state == VoiceSessionState.ACTIVE) {
                lastSession = "сейчас";
            } else {
                lastSession = `<t:${Math.floor(voice.session.endTime.getTime() / 1000)}:R>`;
            }
        }

        return ctx.interaction.reply({
            flags:
                (ctx.options.ephemeral?.value ?? false)
                    ? undefined
                    : ["Ephemeral"],
            embeds: [
                {
                    description:
                        `**Статистика юзера:** <@${target.id}>\n\n` +
                        `**Время в воисе**: \`${voice.time}\`\n` +
                        `**Последняя сессия в воисе:** ${lastSession}\n` +
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
