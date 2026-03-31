import { globalLogger } from "#utils/logger";

process.on("unhandledRejection", (reason) => {
	globalLogger.error("UNHANDLED REJECTION:", reason);
});

process.on("uncaughtException", (error) => {
	globalLogger.error("UNCAUGHT EXCEPTION:", error);
});
