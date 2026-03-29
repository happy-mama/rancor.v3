FROM node:20-alpine

WORKDIR /app

COPY ./prisma.config.ts ./prisma.config.ts
COPY ./prisma ./prisma
COPY ./.env ./.env

RUN npm i prisma
CMD ["npx", "prisma", "migrate", "deploy"]
