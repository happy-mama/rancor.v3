FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY ./prisma.config.ts ./prisma.config.ts
COPY ./prisma ./prisma

CMD ["npx", "prisma", "migrate", "deploy"]
