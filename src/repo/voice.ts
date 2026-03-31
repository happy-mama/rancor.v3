import { VoiceSessionState } from "generated/prisma/enums";
import { prisma } from "#lib/prisma";
import { statsService } from "./stats";

class VoiceService {
	async getSession(discordId: string) {
		const data = await prisma.user.findUnique({
			where: {
				discordId,
			},
			select: {
				voiceSession: true,
			},
		});

		return data?.voiceSession || null;
	}

	async createSession(discordId: string) {
		const data = await prisma.user.update({
			where: {
				discordId,
			},
			data: {
				voiceSession: {
					create: {},
				},
			},
			select: {
				voiceSession: true,
			},
		});

		return data.voiceSession || null;
	}

	async startSession(discordId: string) {
		let session = await this.getSession(discordId);

		if (!session) {
			session = await this.createSession(discordId);

			if (!session) {
				return null;
			}
		}

		if (session.state === VoiceSessionState.ACTIVE) {
			return null;
		}

		await prisma.user.update({
			where: {
				discordId,
			},
			data: {
				voiceSession: {
					update: {
						startTime: new Date(),
						state: "ACTIVE",
					},
				},
			},
		});
	}

	async endSession(discordId: string) {
		const session = await this.getSession(discordId);

		if (!session || session.state !== VoiceSessionState.ACTIVE) {
			return null;
		}

		await prisma.$transaction(async (tx) => {
			const now = new Date();

			await tx.user.update({
				where: {
					discordId,
				},
				data: {
					voiceSession: {
						update: {
							endTime: now,
							state: "ENDED",
						},
					},
					stats: {
						update: {
							voiceTime: {
								increment: now.getTime() - session.startTime.getTime(),
							},
						},
					},
				},
			});
		});
	}

	async getTime(discordId: string) {
		const time = this.formatTime(await this.getTimeRaw(discordId));
		const session = await this.getSession(discordId);

		return { time, session };
	}

	async getTimeRaw(discordId: string) {
		const stats = await statsService.getStats(discordId);

		if (!stats) return 0n;

		const activeSession = await this.getSession(discordId);

		if (!activeSession || activeSession.state !== VoiceSessionState.ACTIVE) {
			return stats.voiceTime;
		}

		const statsTime = stats.voiceTime;
		const sessionTime = Date.now() - activeSession.startTime.getTime();

		return BigInt(sessionTime) + statsTime;
	}

	formatTime(time: bigint) {
		const totalMinutes = Number(time) / 60000;
		const hours = Math.floor(totalMinutes / 60);
		const minutes = Math.floor(totalMinutes % 60);

		return `${hours} ч. ${minutes} м.`;
	}
}

const voiceService = new VoiceService();

export { voiceService };
