import { config } from "#utils/config";

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

class Logger {
	private readonly name: string;
	private allowedLevels: LogLevel[];

	constructor(name: string) {
		this.name = name;

		this.allowedLevels = config.get("LOG_LEVELS").split(",") as LogLevel[];
	}

	private message(data: { level: LogLevel; payload: any }) {
		if (!this.allowedLevels.includes(data.level)) return;

		console.log(
			`[${data.level}] ${new Date().toISOString()} [${this.name}] ${data.payload}`,
		);
	}

	public info(...payload: any) {
		this.message({ level: "INFO", payload });
	}

	public debug(...payload: any) {
		this.message({ level: "DEBUG", payload });
	}

	public warn(...payload: any) {
		this.message({ level: "WARN", payload });
	}

	public error(...payload: any) {
		this.message({ level: "ERROR", payload });
	}
}

const globalLogger = new Logger("GLOBAL");

export { globalLogger, Logger };
