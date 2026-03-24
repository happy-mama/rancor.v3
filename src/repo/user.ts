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
}

const userService = new UserService();

export default userService;
