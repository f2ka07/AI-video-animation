# Slides platform: GUI + Remotion (with Chromium for headless render)
FROM node:20-slim

WORKDIR /app

# Install Chromium for Remotion headless rendering + SSH for RunPod remote access
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-sandbox \
    openssh-server \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application
COPY . .

# Expose GUI port
EXPOSE 3001

# Run GUI server (handles Remotion renders via child process)
CMD ["npx", "tsx", "gui-server.js"]
