# ========================================================
# EdSecure Hub - Production Multi-Stage Dockerfile
# Uses Next.js standalone output for minimal image size
# ========================================================

FROM node:22-alpine AS base

# Stage 1: Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# Stage 3: Runner (standalone output — minimal image)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone server (includes all required node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Copy static assets (not included in standalone by default)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy database & scripts needed at runtime
COPY --from=builder /app/database ./database
COPY --from=builder /app/scripts ./scripts

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]

