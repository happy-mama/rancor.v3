import { prisma, PrismaTX } from "#lib/prisma";

class StatsService {
    async getStats(discordId: string) {
        const user = await prisma.user.findUnique({
            where: {
                discordId: discordId,
            },
            include: {
                stats: true,
            },
        });

        if (!user) return null;

        return user.stats as NonNullable<typeof user.stats>;
    }

    async incrementStatsCommandsUsed(discordId: string) {
        return prisma.user.update({
            where: {
                discordId: discordId,
            },
            data: {
                stats: {
                    update: {
                        commandsUsed: { increment: 1 },
                    },
                },
            },
        });
    }

    async updateStats({
        tx = prisma,
        discordId,
        type,
        value,
    }: {
        tx?: PrismaTX;
        discordId: string;
        type: "messagesSent" | "commandsUsed" | "voiceTime";
        value: number;
    }) {
        return tx.user.update({
            where: {
                discordId: discordId,
            },
            data: {
                stats: {
                    update: {
                        [type]: { increment: value },
                    },
                },
            },
        });
    }
}

const statsService = new StatsService();

export default statsService;
