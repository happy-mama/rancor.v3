# Discord Bot

A multifunctional Discord bot focused on user activity tracking and utility features.

Currently used on a private server. You can self-host it by configuring the `.env` file.

### Features

- User activity tracking:
  - Voice channel time
  - Message count
  - Reaction count
  - Command usage stats
- Gemini AI integration (for smart responses / commands)
- Utility and fun commands
- Custom wrapper around discord.js for easier development

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm i
   ```
3. Copy `.env.example` to `.env`
4. Fill in required environment variables (Discord token, Gemini API key, etc.)
5. Build:
    ```bash
    npm run build
    ```
6. Start:
    ```bash
    npm run start
    ```

### Docker
1. Setup first, then:
    ```bash
    npm run docker:up
    ```
