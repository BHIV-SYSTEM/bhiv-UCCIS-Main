# ============================================================
# UCCIS Platform – Backend Production Dockerfile
# Multi-stage build for Node.js Express backend with SQLite3 & MongoDB
# ============================================================

# ------------------------------------------------------------
# Stage 1: Build & Dependencies
# ------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install native build tools for compiling sqlite3 native bindings if needed
RUN apk add --no-cache python3 make g++

# Copy package dependency manifests
COPY package*.json ./

# Install dependencies (fallback to npm install if lockfile needs sync)
RUN npm ci || npm install

# Copy backend source code
COPY . .

# ------------------------------------------------------------
# Stage 2: Production Runtime
# ------------------------------------------------------------
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for clean process signal handling and curl for container healthcheck
RUN apk add --no-cache dumb-init curl

# Create non-root user for security compliance
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy application and node_modules from builder stage
COPY --from=builder --chown=nodejs:nodejs /app /app

# Ensure runtime directories exist with appropriate ownership
RUN mkdir -p /app/logs /app/runtime_logs /app/database/sqlite /app/data && \
    chown -R nodejs:nodejs /app/logs /app/runtime_logs /app/database/sqlite /app/data

# Switch to unprivileged user
USER nodejs

# Backend listens internally on port 5000
EXPOSE 5000

# Container-level healthcheck against the UCCIS health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Process supervisor
ENTRYPOINT ["dumb-init", "--"]

# Launch UCCIS backend server
CMD ["node", "server.js"]
