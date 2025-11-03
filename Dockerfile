FROM node:18-slim

# Установка build tools для Swiss Ephemeris
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Создание рабочей директории
WORKDIR /app

# Копирование package файлов
COPY package*.json ./

# Установка зависимостей
RUN npm ci --only=production && npm cache clean --force

# Копирование исходного кода
COPY . .

# Экспорт порта (если понадобится HTTP wrapper)
EXPOSE 3000

# Запуск полной версии MCP Server
CMD ["npm", "start"]

