import { Logger } from "#utils/logger";
import { config } from "#utils/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiClient {
    private readonly genAI!: GoogleGenerativeAI;
    private readonly model!: ReturnType<typeof this.genAI.getGenerativeModel>;
    private readonly logger = new Logger("GeminiClient");

    constructor() {
        const geminiAPIKey = config.get("GEMINI_API_KEY");

        if (!geminiAPIKey) {
            this.logger.warn(
                "GEMINI_API_KEY is not set in the environment variables, continue without it",
            );

            return;
        }

        this.genAI = new GoogleGenerativeAI(geminiAPIKey);
        this.model = this.genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
            generationConfig: {
                // maxOutputTokens: 500,
            },
        });
    }

    async generateContent(text: string) {
        try {
            if (!this.model) {
                return "AI features are currently unavailable.";
            }

            const prompt = `
            RULES:
            - Try to answer the question as concisely as possible.
            - Do not add any additional text or explanations if it is not necessary.
            - Reply in user question language.

            User question:
            ${text}
            `;

            const result = await this.model.generateContent(prompt);

            return result.response.text();
        } catch (error) {
            this.logger.error(error);
            return "An error occurred while generating content.";
        }
    }
}

export const geminiClient = new GeminiClient();
