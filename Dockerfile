# 🔹 STAGE 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# ✅ Install dependencies efficiently (skip unnecessary scripts)
COPY package.json package-lock.json ./
RUN npm ci --production --ignore-scripts

# ✅ Copy the rest of the application
COPY . .

# ✅ Build the Next.js application
RUN npm run build

# 🔹 STAGE 2: Production (Final lightweight image)
FROM node:18-alpine AS runner
WORKDIR /app

# ✅ Set production environment
ENV NODE_ENV=production

# ✅ Copy only necessary files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# ✅ Remove unnecessary files (optional)
RUN rm -rf /app/test /app/docs

# ✅ Expose the correct port
EXPOSE 3000

# ✅ Start the application
CMD ["npm", "start"]
