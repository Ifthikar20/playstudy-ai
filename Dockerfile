FROM node:18-alpine AS builder
WORKDIR /app

# First copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the application code
COPY . .

# Copy .env file if it exists
COPY .env* ./

# Build the application
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy built assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env* ./

# Install production dependencies
RUN npm install --production

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]