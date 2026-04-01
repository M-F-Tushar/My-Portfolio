# Multi-stage build for AI Portfolio

# Stage 1: Backend
FROM python:3.14-slim as backend

WORKDIR /app/backend

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .
COPY data/ /app/data/

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# Stage 2: Frontend build
FROM node:18-alpine as frontend-builder

WORKDIR /app/frontend

# Install dependencies
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend code
COPY frontend/ .
COPY content/ /app/content/

# Build Next.js app
RUN npm run build

# Stage 3: Frontend production
FROM node:18-alpine as frontend

WORKDIR /app/frontend

COPY --from=frontend-builder /app/frontend/.next ./.next
COPY --from=frontend-builder /app/frontend/public ./public
COPY --from=frontend-builder /app/frontend/package*.json ./
COPY --from=frontend-builder /app/content /app/content

RUN npm ci --only=production

EXPOSE 3000

CMD ["npm", "start"]
