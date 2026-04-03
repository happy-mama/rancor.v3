FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY ./prisma.config.ts ./prisma.config.ts
COPY ./prisma ./prisma
COPY ./.env ./.env

CMD ["npx", "prisma", "migrate", "deploy"]
