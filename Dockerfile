FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git make g++ python3 py3-pip alpine-sdk libc-dev paxctl

RUN npm i -g pnpm

COPY . .
RUN pnpm install
RUN pnpm run build

FROM node:20-alpine

RUN apk add --no-cache zip unzip bash

RUN npm i -g pnpm

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .env ./

RUN pnpm install --prod

RUN npx prisma generate

ENV TZ=Asia/Shanghai

EXPOSE 3000

CMD ["pnpm", "start:migrate:prod"]
