#!/usr/bin/env node

/**
 * HTTP Wrapper для Human Design MCP Server
 * Для использования на Railway или других платформах
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import express from 'express';
import { spawn } from 'child_process';
import readline from 'readline';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'human-design-mcp-server',
    version: '1.0.0-full',
    timestamp: new Date().toISOString(),
  });
});

// Main endpoint
app.post('/api/human-design', async (req, res) => {
  try {
    const { birthDate, birthTime, birthLocation, latitude, longitude } = req.body;

    // Валидация
    if (!birthDate || !birthTime || !birthLocation) {
      return res.status(400).json({
        success: false,
        error: 'birthDate, birthTime, and birthLocation are required',
      });
    }

    // Используем прямое вычисление для лучшей производительности
    const { calculateHumanDesign } = require('./src/calculations-cjs.cjs');
    
    const result = await calculateHumanDesign({
      birthDate,
      birthTime,
      birthLocation,
      latitude,
      longitude,
    });

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Error calculating Human Design:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Альтернативный endpoint через MCP (если нужно)
app.post('/api/mcp/calculate', async (req, res) => {
  try {
    // Запускаем MCP сервер через stdio
    const mcpServer = spawn('node', ['index-with-swiss.js']);
    
    const rl = readline.createInterface({
      input: mcpServer.stdout,
      output: mcpServer.stdin,
    });

    // Отправка MCP запроса
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'calculate_human_design',
        arguments: req.body,
      },
    };

    mcpServer.stdin.write(JSON.stringify(request) + '\n');

    // Чтение ответа
    rl.once('line', (line) => {
      try {
        const response = JSON.parse(line);
        if (response.result) {
          res.json({ success: true, data: response.result });
        } else if (response.error) {
          res.status(500).json({ success: false, error: response.error });
        }
      } catch (parseError) {
        res.status(500).json({ success: false, error: 'Failed to parse response' });
      }
      mcpServer.kill();
    });

    // Таймаут
    setTimeout(() => {
      mcpServer.kill();
      res.status(500).json({ success: false, error: 'Request timeout' });
    }, 10000);

  } catch (error) {
    console.error('Error in MCP call:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Human Design MCP Server',
    version: '1.0.0-full',
    endpoints: {
      health: '/health',
      calculate: '/api/human-design',
      mcp: '/api/mcp/calculate',
    },
    documentation: 'https://github.com/dvvolkovv/MCP_Human_design',
  });
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Human Design MCP Server (HTTP) running on port ${PORT}`);
  console.log(`📖 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`🔗 API endpoint: http://0.0.0.0:${PORT}/api/human-design`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

