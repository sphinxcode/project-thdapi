# Использование полной версии с Swiss Ephemeris

## Описание

Проект поддерживает два режима работы:

1. **Упрощенная версия** (`index.js`) - быстрые расчеты для демонстрации
2. **Полная версия** (`index-with-swiss.js`) - точные расчеты с Swiss Ephemeris

## Установка Swiss Ephemeris

### Автоматическая установка

```bash
npm install
```

Swiss Ephemeris установится автоматически как зависимость.

### Требования для компиляции

Swiss Ephemeris требует компиляции нативных модулей. Убедитесь, что установлены:

#### macOS
```bash
xcode-select --install
```

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install build-essential node-gyp python3
```

#### Fedora/RHEL
```bash
sudo dnf groupinstall "Development Tools"
sudo dnf install node-gyp python3
```

#### Windows
Установите [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/) или [Visual Studio Community](https://visualstudio.microsoft.com/vs/community/).

## Запуск

### Упрощенная версия (по умолчанию)

```bash
npm start
# или
npm run dev
```

### Полная версия с Swiss Ephemeris

```bash
npm run start:full
# или
npm run dev:full
```

## Сравнение версий

| Параметр | Упрощенная | Полная (Swiss Ephemeris) |
|----------|-----------|-------------------------|
| Скорость | ⚡ Быстро | ⚡⚡ Средне |
| Точность | ~50% | 🎯 100% |
| Зависимости | Только SDK | SDK + Swiss Ephemeris |
| Расчет планет | Демо-данные | Реальные позиции |
| Ворота | Приблизительно | Точные |
| Готовность к production | ❌ Демо | ✅ Да |

## Пример использования

### Через MCP

```bash
# Упрощенная версия
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"calculate_human_design","arguments":{"birthDate":"1990-05-15","birthTime":"14:30","birthLocation":"Москва"}}}' | npm start

# Полная версия
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"calculate_human_design","arguments":{"birthDate":"1990-05-15","birthTime":"14:30","birthLocation":"Москва"}}}' | npm run start:full
```

### Через прямую интеграцию

#### Упрощенная версия
```javascript
import { calculateHumanDesignSimple } from './src/simple-calculations.js';

const result = await calculateHumanDesignSimple({
  birthDate: '1990-05-15',
  birthTime: '14:30',
  birthLocation: 'Москва, Россия'
});
```

#### Полная версия
```javascript
const { calculateHumanDesign } = require('./src/calculations-cjs.cjs');

const result = await calculateHumanDesign({
  birthDate: '1990-05-15',
  birthTime: '14:30',
  birthLocation: 'Москва, Россия',
  latitude: 55.7558,
  longitude: 37.6173
});
```

## Разница в результатах

### Упрощенная версия

```json
{
  "gates": [
    {
      "planet": "Sun",
      "gate": 19,
      "line": 2,
      "name": "Approach"
    }
  ],
  "calculationNote": "Это демо-расчет. Для точных результатов используйте полную версию MCP сервера."
}
```

### Полная версия

```json
{
  "gates": [
    {
      "planet": "Sun",
      "gate": 19,
      "line": 2,
      "name": "Approach",
      "ru_name": "Подход",
      "sign": 1,
      "hexagram": 19,
      "longitude": 19.45
    }
  ],
  "calculationSource": "Swiss Ephemeris",
  "version": "1.0.0-full"
}
```

## Интеграция с n8n

### Вариант 1: Используйте прямо в Code Node

```javascript
// В n8n Code Node
const { calculateHumanDesign } = require('/path/to/human_design/src/calculations-cjs.cjs');

const result = await calculateHumanDesign({
  birthDate: $input.item.json.birthDate,
  birthTime: $input.item.json.birthTime,
  birthLocation: $input.item.json.birthLocation,
});

return { json: result };
```

### Вариант 2: HTTP API

Создайте отдельный сервер:

```javascript
// api-server.js
const express = require('express');
const { calculateHumanDesign } = require('./src/calculations-cjs.cjs');

const app = express();
app.use(express.json());

app.post('/api/human-design', async (req, res) => {
  try {
    const result = await calculateHumanDesign(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log('API server running on http://localhost:3000');
});
```

Запустите:
```bash
node api-server.js
```

## Решение проблем

### Ошибка: Cannot find module 'swisseph'

```bash
npm install swisseph
# или переустановите все зависимости
rm -rf node_modules package-lock.json
npm install
```

### Ошибка: node-gyp rebuild failed

Установите build tools для вашей системы (см. раздел "Требования для компиляции").

### Ошибка: swisseph.node is not a valid Win32 application

Это означает, что модуль скомпилирован для другой платформы. Переустановите:

```bash
npm rebuild swisseph
```

### Ошибка в n8n: require is not defined

Для n8n используйте dynamic import:

```javascript
const swissephModule = await import('/path/to/human_design/src/calculations-cjs.cjs');
const { calculateHumanDesign } = swissephModule.default || swissephModule;
```

Или просто используйте упрощенную версию в n8n.

## Производительность

- **Упрощенная версия**: ~10ms на расчет
- **Полная версия**: ~50-100ms на расчет

Для большинства случаев это приемлемо.

## Рекомендации

- **Для разработки/демо**: используйте упрощенную версию
- **Для production**: используйте полную версию
- **Для n8n**: если возникают проблемы с Swiss Ephemeris, используйте упрощенную версию
- **Для Docker**: обязательно установите build tools в образе

## Docker пример

```dockerfile
FROM node:18

WORKDIR /app

# Установите build tools
RUN apt-get update && apt-get install -y build-essential python3

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "start:full"]
```

## Дополнительная информация

- [Swiss Ephemeris документация](https://www.astro.com/swisseph/swephinfo_e.htm)
- [Swiss Ephemeris npm package](https://www.npmjs.com/package/swisseph)
- [Human Design System](https://www.humandesign.me/)

