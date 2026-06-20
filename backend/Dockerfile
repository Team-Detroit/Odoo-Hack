# ==========================================
# Build Stage
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (for caching)
COPY package*.json ./
RUN npm ci

# Copy Prisma schema and generate Client
COPY src/database/prisma ./src/database/prisma/
RUN npx prisma generate

# Copy source code and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ==========================================
# Production Stage
# ==========================================
FROM node:20-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy generated Prisma Client and build output
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/database/prisma ./src/database/prisma

# Copy entrypoint script
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 5000

ENTRYPOINT ["./entrypoint.sh"]
