# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Copy .env file if it exists (optional for build-time vars)
COPY .env* ./

# Build the Next.js application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --production --ignore-scripts

# Optional: Copy .env for local testing, but prefer runtime injection in prod
# COPY --from=builder /app/.env* ./

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]