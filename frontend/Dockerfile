# ==========================================
# Build Stage
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (for caching)
COPY package*.json ./
RUN npm ci

# Copy configuration and source files
COPY eslint.config.js vite.config.ts tsconfig*.json index.html ./
COPY public ./public
COPY src ./src

# Set build-time environment variables
ENV VITE_API_URL=/api
ENV VITE_SOCKET_URL=/

# Build the Vite application
RUN npm run build

# ==========================================
# Production Stage
# ==========================================
FROM nginx:alpine

# Copy built frontend assets to Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
