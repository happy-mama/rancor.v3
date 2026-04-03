import { client } from "#src/client";
import { prisma } from "#lib/prisma";
import { globalLogger } from "#utils/logger";

const gracefulShutdown = async (signal: string) => {
	globalLogger.info(`Received ${signal}. Shutting down gracefully...`);

	client.destroy();

	try {
		await prisma.$disconnect();
		globalLogger.info("Database connection closed.");
	} catch (error) {
		globalLogger.error("Error disconnecting from database:", error);
	}

	process.exit(0);
};

process.on("unhandledRejection", (reason) => {
	globalLogger.error("UNHANDLED REJECTION:", reason);
});

process.on("uncaughtException", (error) => {
	globalLogger.error("UNCAUGHT EXCEPTION:", error);
});

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
