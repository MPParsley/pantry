# Backend Dockerfile for Pantry MVP
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Builder stage
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build TypeScript
RUN npm run build:backend

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 pantry

# Copy necessary files
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/package*.json ./
COPY --from=deps /app/node_modules ./node_modules

# Create data directory for SQLite
RUN mkdir -p /app/data && chown pantry:nodejs /app/data

USER pantry

EXPOSE 3000

ENV DATABASE_PATH=/app/data/pantry.db

CMD ["node", "backend/dist/server.js"]
