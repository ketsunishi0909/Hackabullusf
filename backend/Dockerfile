FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src/ ./src/
RUN npm run build

FROM node:22-alpine
WORKDIR /app

# better-sqlite3 needs Python + build tools at runtime on Alpine
RUN apk add --no-cache python3 make g++

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

VOLUME ["/app/data"]
ENV DB_PATH=/app/data/attendees.db
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/server.js"]
