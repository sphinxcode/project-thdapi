#!/usr/bin/env node

/**
 * HTTP Wrapper for Human Design MCP Server
 * With Bearer Token Authentication
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import express from 'express';
import { spawn } from 'child_process';
import readline from 'readline';

// Load Swiss Ephemeris version
const { calculateHumanDesign } = require('./src/calculations-cjs.cjs');
console.log('✅ Swiss Ephemeris version loaded');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || 'your-secret-api-key-change-this';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - Missing or invalid Authorization header',
      message: 'Please provide: Authorization: Bearer YOUR_API_KEY'
    });
  }
  
  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  
  if (token !== API_KEY) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden - Invalid API key'
    });
  }
  
  next();
};

// Public health check (no auth required)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'human-design-mcp-server',
    version: '1.0.0-full',
    timestamp: new Date().toISOString(),
    auth: 'enabled'
  });
});

// Protected: Main endpoint
app.post('/api/human-design', authMiddleware, async (req, res) => {
  try {
    const { birthDate, birthTime, birthLocation, latitude, longitude } = req.body;

    // Validation
    if (!birthDate || !birthTime || !birthLocation) {
      return res.status(400).json({
        success: false,
        error: 'birthDate, birthTime, and birthLocation are required',
      });
    }

    // Calculate using Swiss Ephemeris
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

// Protected: Alternative MCP endpoint
app.post('/api/mcp/calculate', authMiddleware, async (req, res) => {
  try {
    const mcpServer = spawn('node', ['index-with-swiss.js']);
    
    const rl = readline.createInterface({
      input: mcpServer.stdout,
      output: mcpServer.stdin,
    });

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
    auth: 'Bearer token required',
    endpoints: {
      health: '/health (public)',
      calculate: '/api/human-design (protected)',
      mcp: '/api/mcp/calculate (protected)',
    },
    documentation: 'https://github.com/sphinxcode/humandesignmcp',
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Human Design MCP Server running on port ${PORT}`);
  console.log(`🔐 Auth: Bearer token enabled`);
  console.log(`📖 Health: http://0.0.0.0:${PORT}/health`);
  console.log(`🔗 API: http://0.0.0.0:${PORT}/api/human-design`);
  
  if (API_KEY === 'your-secret-api-key-change-this') {
    console.warn('⚠️  WARNING: Using default API key! Set API_KEY environment variable.');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});
