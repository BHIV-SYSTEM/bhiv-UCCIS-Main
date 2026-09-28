# ============================================================
# UCCIS Platform – Frontend Production Dockerfile
# Multi-stage build for React.js application served via static server
# ============================================================

# ------------------------------------------------------------
# Stage 1: Build React App
# ------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install dependencies (fallback to npm install if lockfile needs sync)
RUN npm ci || npm install

# Copy source code
COPY . .

# Accept build-time arguments for React environment variables
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build production bundle (outputs to /app/build)
RUN npm run build

# ------------------------------------------------------------
# Stage 2: Production Static File Server
# ------------------------------------------------------------
FROM node:20-alpine

WORKDIR /app

# Install lightweight, production-ready static server
RUN npm install -g serve

# Copy compiled React build artifacts from builder stage
COPY --from=builder /app/build ./build

# Create non-root user for security
RUN adduser --disabled-password --gecos "" frontend && \
    mkdir -p /app/data/cache && \
    chown -R frontend:frontend /app

# Switch to unprivileged user
USER frontend

# Internal container port
EXPOSE 3000

# Container healthcheck testing static server availability
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Serve production build on port 3000
CMD ["serve", "-s", "build", "-l", "3000"]
