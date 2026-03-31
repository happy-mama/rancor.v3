import z from "zod";

const envSchema = z.object({
	DISCORD_BOT_TOKEN: z.string().nonempty(),
	DISCORD_BOT_ID: z.string().nonempty(),
	DISCORD_APPLICATION_ID: z.string().nonempty(),
	DB_PASSWORD: z.string().nonempty(),
	DB_USER: z.string().nonempty(),
	DB_HOST: z.string().nonempty(),
	DB_PORT: z.coerce.number(),
	DB_NAME: z.string().nonempty(),
	GUILD_TESTS_ID: z.string().nonempty(),
	GUILD_MAIN_ID: z.string().nonempty(),
	LOG_LEVELS: z.string(),
	GEMINI_API_KEY: z.string(),
});

class Config {
	private readonly data: z.infer<typeof envSchema>;

	constructor() {
		const result = envSchema.loose().safeParse(process.env);

		if (!result.success) {
			throw new Error(`Invalid environment variables: ${result.error}`);
		}

		this.data = result.data;
	}

	get<T extends keyof typeof this.data>(path: T) {
		return this.data[path];
	}
}

export const config = new Config();
