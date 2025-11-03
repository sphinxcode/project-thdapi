# Деплой на Railway

## Подготовка

Проект настроен для деплоя на Railway с использованием:
- **HTTP Server** (по умолчанию) - для доступа через HTTP API
- **Swiss Ephemeris** - полная версия с точными расчетами
- **Express** - HTTP wrapper для Railway

## Быстрый старт

### 1. Создание проекта на Railway

1. Откройте [railway.app](https://railway.app)
2. Войдите или зарегистрируйтесь
3. Нажмите **"New Project"**
4. Выберите **"Deploy from GitHub repo"**
5. Выберите репозиторий: `dvvolkovv/MCP_Human_design`

### 2. Настройка деплоя

Railway автоматически:
- Определит Node.js проект
- Установит зависимости
- Соберет Swiss Ephemeris (может занять 2-3 минуты)
- Запустит HTTP сервер

### 3. Получение URL

После успешного деплоя:

1. Откройте ваш проект в Railway
2. Перейдите в **Settings** → **Networking**
3. Нажмите **"Generate Domain"**
4. Скопируйте URL (например: `https://your-project.up.railway.app`)

## Использование

### Health Check

```bash
curl https://your-project.up.railway.app/health
```

Ответ:
```json
{
  "status": "ok",
  "service": "human-design-mcp-server",
  "version": "1.0.0-full",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Расчет Human Design

```bash
curl -X POST https://your-project.up.railway.app/api/human-design \
  -H "Content-Type: application/json" \
  -d '{
    "birthDate": "1990-05-15",
    "birthTime": "14:30",
    "birthLocation": "Москва, Россия"
  }'
```

Ответ:
```json
{
  "success": true,
  "data": {
    "birthDate": "1990-05-15",
    "birthTime": "14:30",
    "birthLocation": "Москва, Россия",
    "type": {
      "name": "Generator",
      "description": "Генератор"
    },
    "strategy": "Отвечать",
    "authority": {
      "name": "Sacral",
      "description": "Сакральная авторитет"
    },
    "profile": {
      "number": "3/5",
      "description": "Профиль 3/5"
    },
    "gates": [...],
    "calculationSource": "Swiss Ephemeris"
  }
}
```

## Интеграция с n8n

### Вариант 1: HTTP Request Node

**URL:** `https://your-project.up.railway.app/api/human-design`

**Method:** POST

**Body:**
```json
{
  "birthDate": "{{ $json.birthDate }}",
  "birthTime": "{{ $json.birthTime }}",
  "birthLocation": "{{ $json.birthLocation }}"
}
```

### Вариант 2: Function Node

```javascript
const response = await fetch('https://your-project.up.railway.app/api/human-design', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    birthDate: $input.item.json.birthDate,
    birthTime: $input.item.json.birthTime,
    birthLocation: $input.item.json.birthLocation,
  }),
});

const result = await response.json();
return { json: result.data };
```

## Переменные окружения

Railway автоматически создает:
- `PORT` - порт для HTTP сервера (Railway назначает автоматически)
- `NODE_ENV=production` - окружение production

## Мониторинг

### Логи

В Railway Dashboard:
1. Откройте проект
2. Перейдите в **Deployments**
3. Нажмите на последний деплой
4. Смотрите логи в реальном времени

### Метрики

Railway предоставляет:
- **CPU usage**
- **Memory usage**
- **Network traffic**
- **Request count**

## Обновление

### Автоматический деплой

Railway автоматически деплоит при push в `main` branch.

### Ручной деплой

1. В Railway Dashboard нажмите **"Redeploy"**
2. Или сделайте push в `main`:
```bash
git push origin main
```

## Решение проблем

### Build failed: Swiss Ephemeris

**Проблема:** Ошибка компиляции Swiss Ephemeris

**Решение:** Railway автоматически установит build tools через Nixpacks. Если проблема сохраняется, проверьте `nixpacks.toml`.

### Deployment failed: Module not found

**Проблема:** Express или другие модули не найдены

**Решение:**
```bash
# Убедитесь что все зависимости в package.json
npm install express

# Commit и push
git add package.json package-lock.json
git commit -m "Add dependencies"
git push
```

### Service unavailable

**Проблема:** 503 или таймауты

**Решение:**
1. Проверьте логи в Railway
2. Убедитесь что порт настроен правильно (Railway автоматически)
3. Проверьте health check: `/health`

### Out of memory

**Проблема:** Превышен лимит памяти

**Решение:**
1. В Railway Settings увеличьте план
2. Или оптимизируйте код
3. Используйте упрощенную версию для демо

## Стоимость

### Free Tier
- $5 бесплатно в месяц
- Подходит для демо и тестирования

### Paid Plans
- Pay-as-you-go
- От $5/месяц для стабильного использования

## Альтернативы Railway

Если Railway не подходит:

### Vercel
```bash
vercel deploy
```

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Render
```bash
# Connect GitHub repo in Render Dashboard
```

### DigitalOcean App Platform
```bash
# Use Dockerfile
```

## Docker деплой

Если хотите использовать Docker напрямую:

```bash
docker build -t human-design-server .
docker run -p 3000:3000 human-design-server
```

Railway также поддерживает Dockerfile автоматически.

## Проверка статуса

```bash
# Health check
curl https://your-project.up.railway.app/health

# API endpoint
curl https://your-project.up.railway.app/api/human-design \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"birthDate":"1990-05-15","birthTime":"14:30","birthLocation":"Москва"}'
```

## Дополнительная информация

- **Railway Docs**: https://docs.railway.app
- **GitHub Repo**: https://github.com/dvvolkovv/MCP_Human_design
- **Support**: Создайте issue на GitHub

## Примеры использования

### JavaScript/Node.js

```javascript
const fetch = require('node-fetch');

async function calculateHumanDesign(birthDate, birthTime, birthLocation) {
  const response = await fetch('https://your-project.up.railway.app/api/human-design', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ birthDate, birthTime, birthLocation }),
  });
  
  const result = await response.json();
  return result.data;
}

// Использование
const hd = await calculateHumanDesign('1990-05-15', '14:30', 'Москва');
console.log(`Type: ${hd.type.ru_name}`);
console.log(`Strategy: ${hd.strategy}`);
```

### Python

```python
import requests

def calculate_human_design(birth_date, birth_time, birth_location):
    url = 'https://your-project.up.railway.app/api/human-design'
    response = requests.post(url, json={
        'birthDate': birth_date,
        'birthTime': birth_time,
        'birthLocation': birth_location
    })
    return response.json()['data']

# Использование
hd = calculate_human_design('1990-05-15', '14:30', 'Москва')
print(f"Type: {hd['type']['ru_name']}")
print(f"Strategy: {hd['strategy']}")
```

### cURL

```bash
#!/bin/bash

API_URL="https://your-project.up.railway.app/api/human-design"

curl -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{
    "birthDate": "1990-05-15",
    "birthTime": "14:30",
    "birthLocation": "Москва, Россия"
  }' | jq .
```

## Безопасность

1. **HTTPS** - Railway предоставляет автоматически
2. **Rate Limiting** - добавьте при необходимости
3. **Auth** - для production добавьте API key
4. **Validation** - валидация входных данных уже есть

## Рекомендации

- Используйте custom domain для production
- Настройте мониторинг и алерты
- Добавьте rate limiting для публичных API
- Создайте резервные копии данных
- Настройте CI/CD для автоматического тестирования

