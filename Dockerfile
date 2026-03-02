# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files trước để tận dụng cache
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Cài dependency
RUN npm ci

# Copy source code
COPY . .

# Build Next.js
RUN npm run build


# ---------- Stage 2: Run ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Chỉ copy file cần thiết từ builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]