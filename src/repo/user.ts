import { UserRole } from "#generated/prisma/enums";
import { prisma } from "#lib/prisma";

class UserService {
	public async getUser(props: { discordId: string } | { id: number }) {
		let where: { discordId: string } | { id: number };

		if ("discordId" in props) {
			where = { discordId: props.discordId };
		} else {
			where = { id: props.id };
		}

		return prisma.user.findUnique({
			where,
			include: {
				stats: true,
				voiceSession: true,
			},
		});
	}

	public async createUser({
		discordId,
		username,
	}: {
		discordId: string;
		username: string;
	}) {
		if (await this.getUser({ discordId })) return;

		return prisma.user.create({
			data: {
				discordId,
				username,
				stats: { create: {} },
				voiceSession: { create: {} },
			},
		});
	}

	public async isAdmin({ discordId }: { discordId: string }) {
		const data = await prisma.user.findUnique({
			where: {
				discordId,
			},
			select: {
				role: true,
			},
		});

		return data?.role === UserRole.ADMIN;
	}
}

const userService = new UserService();

export { userService };
