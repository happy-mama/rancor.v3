import { createGoogleGenerativeAI, type google } from "@ai-sdk/google";
import { generateText } from "ai";
import { config } from "#utils/config";
import { Logger } from "#utils/logger";

type GoogleModel = ReturnType<typeof google>;

class AIClient {
	private readonly google: ReturnType<typeof createGoogleGenerativeAI> | null =
		null;
	private readonly model: GoogleModel | null = null;
	private readonly logger = new Logger("AIClient");

	constructor() {
		const geminiAPIKey = config.get("GEMINI_API_KEY");

		if (!geminiAPIKey) {
			this.logger.warn(
				"GEMINI_API_KEY is not set in the environment variables, continue without it",
			);

			return;
		}

		this.google = createGoogleGenerativeAI({
			apiKey: geminiAPIKey,
		});
		this.model = this.google("gemini-2.5-flash-lite");
	}

	async generateContent(text: string) {
		try {
			if (!this.model) {
				return "AI features are currently unavailable.";
			}

			const { text: response } = await generateText({
				model: this.model,
				system: `
            RULES:
            - Try to answer the question as concisely as possible.
            - Do not add any additional text or explanations if it is not necessary.
            - Reply in user question language.
            `,
				prompt: text,
			});

			return response;
		} catch (error) {
			this.logger.error(error);
			return "An error occurred while generating content.";
		}
	}
}

export const aiClient = new AIClient();
