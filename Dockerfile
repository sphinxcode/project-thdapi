# Railway Dockerfile for Human Design MCP Server
FROM node:18-slim

# Install Python 3.11 and build tools for swisseph
RUN apt-get update && apt-get install -y \
    python3.11 \
    python3.11-dev \
    build-essential \
    gcc \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/*

# Set Python 3.11 as default
RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Rebuild swisseph with Python 3.11
RUN npm rebuild swisseph

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
