import { type PrismaTX, prisma } from "#lib/prisma";
import type { UserStatsKeys } from "#types/repo";
import { config } from "#utils/config";

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
		type: UserStatsKeys;
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

	async getTopStats({
		tx = prisma,
		type,
		limit = 10,
	}: {
		tx?: PrismaTX;
		type: UserStatsKeys;
		limit?: number;
	}) {
		return await tx.stats.findMany({
			where: {
				user: {
					discordId: { not: config.get("DISCORD_BOT_ID") },
				},
			},
			orderBy: {
				[type]: "desc",
			},
			take: limit,
			include: {
				user: true,
			},
		});
	}
}

const statsService = new StatsService();

export { statsService };
