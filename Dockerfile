# 🔹 STAGE 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY . .
RUN npm run build

# 🔹 STAGE 2: Production (Final lightweight image)
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

RUN npm ci --omit=dev --ignore-scripts

EXPOSE 3000

CMD ["npm", "start"]