import { PrismaPg } from "@prisma/adapter-pg";
import type { DefaultArgs } from "@prisma/client/runtime/client";
import { PrismaClient } from "#generated/prisma/client";
import { config } from "#src/utils/config";

const connectionString = `postgresql://${config.get("DB_USER")}:${config.get("DB_PASSWORD")}@${config.get("DB_HOST")}:${config.get("DB_PORT")}/${config.get("DB_NAME")}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };

export type PrismaTX = Omit<
	PrismaClient<never, undefined, DefaultArgs>,
	"$connect" | "$disconnect" | "$on" | "$use" | "$extends"
>;
