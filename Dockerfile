# 🔹 STAGE 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# ✅ Copy package files first for efficient caching
COPY package.json package-lock.json ./

# ✅ Fix: Use --omit=dev instead of --production
RUN npm ci --omit=dev --ignore-scripts

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
COPY --from=builder ./public
COPY --from=builder /app/package.json ./package.json

# ✅ Install only production dependencies (from lock file)
RUN npm ci --omit=dev --ignore-scripts

# ✅ Expose the correct port
EXPOSE 3000

# ✅ Start the application
CMD ["npm", "start"]
