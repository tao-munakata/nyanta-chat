# ===== ビルドステージ =====
FROM node:20-alpine AS builder
WORKDIR /app

# better-sqlite3のネイティブビルドに必要
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --frozen-lockfile

COPY . .
ENV NEXT_PRIVATE_STANDALONE=true
RUN npm run build

# ===== 本番実行ステージ =====
FROM node:20-alpine AS runner
WORKDIR /app

# better-sqlite3のランタイム依存
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# dataディレクトリ（SQLite永続化用）
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]
