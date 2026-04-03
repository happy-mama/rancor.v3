# Rancor v3

A multifunctional Discord bot focused on user activity tracking and utility features.

## Features

- **User activity tracking:**
  - Voice channel time
  - Message count
  - Reaction count
  - Command usage stats
- **AI integration** — Gemini-powered Q&A command
- **Utility & moderation** — message clearing, stats, top users
- **Fun commands** — ask, AI chat, and more

## Commands

| Command | Description | Permissions |
|---------|-------------|-------------|
| `/ai <prompt> [ephemeral]` | Ask AI any question | Everyone |
| `/ask <text>` | Get a random answer to "Is it true..." | Everyone |
| `/stats [user] [ephemeral]` | View user statistics | Everyone |
| `/top <category> [ephemeral]` | Show top users by category | Everyone |
| `/clear <amount> [user]` | Delete last X messages | Manage Messages |

## Setup

### Prerequisites

- Node.js 22+
- PostgreSQL 17+
- Discord Bot Token ([Discord Developer Portal](https://discord.com/developers/applications))
- Gemini API Key ([Google AI Studio](https://aistudio.google.com/))

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_BOT_TOKEN` | Discord bot token | Yes |
| `DISCORD_BOT_ID` | Bot user ID (usually equals application ID) | Yes |
| `DISCORD_APPLICATION_ID` | Discord application ID | Yes |
| `DB_USER` | PostgreSQL username | Yes |
| `DB_PASSWORD` | PostgreSQL password | Yes |
| `DB_HOST` | PostgreSQL host | Yes |
| `DB_PORT` | PostgreSQL port (default: `5432`) | Yes |
| `DB_NAME` | PostgreSQL database name | Yes |
| `GUILD_TESTS_ID` | Test guild ID (for development) | No |
| `GUILD_MAIN_ID` | Main guild ID | No |
| `LOG_LEVELS` | Comma-separated log levels: `DEBUG,INFO,WARN,ERROR` | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes (for AI commands) |

### Local Development

```bash
# 1. Install dependencies
npm i

# 2. Copy and configure environment
cp .env.example .env

# 3. Run database migrations
npx prisma migrate dev

# 4. Build
npm run build

# 5. Start
npm run start
```

### Docker

```bash
# 1. Copy and configure environment
cp .env.example .env

# 2. Start all services (PostgreSQL + migrations + bot)
npm run docker:up
```

The Docker Compose setup includes:
- **PostgreSQL 17** — database with healthcheck
- **Migrations** — runs Prisma migrations before the bot starts
- **App** — the bot itself, starts after successful migrations

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start in development mode with tsx |
| `npm run build` | Build TypeScript to JavaScript |
| `npm run start` | Start the built JavaScript |
| `npm run lint:prisma` | Format Prisma schema |
| `npm run migrate:prisma` | Run Prisma migrations |
| `npm run generate:prisma` | Generate Prisma client |
| `npm run docker:up` | Start Docker Compose stack |

## Project Structure

```
src/
├── commands/       # Command definitions
│   ├── fun/        # Fun commands (ai, ask)
│   ├── mod/        # Moderation commands (clear)
│   └── stats/      # Stats commands (stats, top)
├── events/         # Discord event handlers
├── lib/            # Core libraries (AI, Prisma)
├── repo/           # Database repositories
├── types/          # TypeScript type definitions
└── utils/          # Utilities (config, logger, colors)
```

## Tech Stack

- **Runtime:** Node.js 22
- **Language:** TypeScript
- **Framework:** discord.js v14
- **Database:** PostgreSQL 17
- **ORM:** Prisma 7
- **AI:** Vercel AI SDK v6 + Google Gemini
- **Container:** Docker + Docker Compose
