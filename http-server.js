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
const { transformToV1, transformToV2 } = require('./src/response-transformers.cjs');
console.log('✅ Swiss Ephemeris version loaded');
console.log('✅ V1/V2 Response Transformers loaded');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || 'your-secret-api-key-change-this';
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

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
    version: '1.1.0-hybrid-location',
    timestamp: new Date().toISOString(),
    auth: 'enabled',
    features: {
      staticDatabase: true,
      googleMapsIntegration: !!GOOGLE_MAPS_API_KEY
    }
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
      googleMapsApiKey: GOOGLE_MAPS_API_KEY,
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

// =============================================================================
// V1 Endpoint - Lean Enterprise API
// =============================================================================
app.post('/api/v1/data', authMiddleware, async (req, res) => {
  try {
    const { birthDate, birthTime, birthLocation, latitude, longitude } = req.body;

    if (!birthDate || !birthTime || !birthLocation) {
      return res.status(400).json({
        success: false,
        error: 'birthDate, birthTime, and birthLocation are required',
      });
    }

    const fullResult = await calculateHumanDesign({
      birthDate,
      birthTime,
      birthLocation,
      latitude,
      longitude,
      googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    // Transform to V1 lean format
    const v1Result = transformToV1(fullResult);

    res.json({
      success: true,
      meta: {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoint: 'v1'
      },
      data: v1Result,
    });
  } catch (error) {
    console.error('Error calculating Human Design (V1):', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// V1 Endpoint with Tooltips - Lean Enterprise API + Full Tooltips
// =============================================================================
app.post('/api/v1/data-tooltip', authMiddleware, async (req, res) => {
  try {
    const { birthDate, birthTime, birthLocation, latitude, longitude } = req.body;

    if (!birthDate || !birthTime || !birthLocation) {
      return res.status(400).json({
        success: false,
        error: 'birthDate, birthTime, and birthLocation are required',
      });
    }

    const fullResult = await calculateHumanDesign({
      birthDate,
      birthTime,
      birthLocation,
      latitude,
      longitude,
      googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    // Transform to V1 with full tooltips
    const v1Result = transformToV1(fullResult, true);

    res.json({
      success: true,
      meta: {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoint: 'v1-tooltip'
      },
      data: v1Result,
    });
  } catch (error) {
    console.error('Error calculating Human Design (V1-tooltip):', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// V2 Endpoint - Full Featured API (empty tooltips by default)
// =============================================================================
app.post('/api/v2/data', authMiddleware, async (req, res) => {
  try {
    const { birthDate, birthTime, birthLocation, latitude, longitude } = req.body;

    if (!birthDate || !birthTime || !birthLocation) {
      return res.status(400).json({
        success: false,
        error: 'birthDate, birthTime, and birthLocation are required',
      });
    }

    const fullResult = await calculateHumanDesign({
      birthDate,
      birthTime,
      birthLocation,
      latitude,
      longitude,
      googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    // Transform to V2 format (empty tooltips)
    const v2Result = transformToV2(fullResult, false);

    res.json({
      success: true,
      meta: {
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        endpoint: 'v2'
      },
      data: v2Result,
    });
  } catch (error) {
    console.error('Error calculating Human Design (V2):', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// V2 Endpoint with Tooltips - Full Featured API + Full Tooltips
// =============================================================================
app.post('/api/v2/data-tooltip', authMiddleware, async (req, res) => {
  try {
    const { birthDate, birthTime, birthLocation, latitude, longitude } = req.body;

    if (!birthDate || !birthTime || !birthLocation) {
      return res.status(400).json({
        success: false,
        error: 'birthDate, birthTime, and birthLocation are required',
      });
    }

    const fullResult = await calculateHumanDesign({
      birthDate,
      birthTime,
      birthLocation,
      latitude,
      longitude,
      googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    // Transform to V2 with full tooltips
    const v2Result = transformToV2(fullResult, true);

    res.json({
      success: true,
      meta: {
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        endpoint: 'v2-tooltip'
      },
      data: v2Result,
    });
  } catch (error) {
    console.error('Error calculating Human Design (V2-tooltip):', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

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
    version: '2.1.0',
    auth: 'Bearer token required',
    features: {
      staticDatabase: 'Major cities worldwide',
      googleMapsIntegration: GOOGLE_MAPS_API_KEY ? 'Enabled (fallback for unknown locations)' : 'Disabled',
      asteroids: 'Chiron, Ceres, Pallas, Juno, Vesta',
      chartAngles: 'AC, MC, IC, DC'
    },
    endpoints: {
      health: '/health (public)',
      v1: '/api/v1/data - Lean enterprise (empty tooltips)',
      v1Tooltip: '/api/v1/data-tooltip - Lean enterprise (full tooltips)',
      v2: '/api/v2/data - Full featured (empty tooltips)',
      v2Tooltip: '/api/v2/data-tooltip - Full featured (full tooltips)',
      legacy: '/api/human-design - Original format',
      mcp: '/api/mcp/calculate',
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
  console.log(`🌍 Location: Static DB + ${GOOGLE_MAPS_API_KEY ? 'Google Maps (enabled)' : 'Manual coords only'}`);

  if (API_KEY === 'your-secret-api-key-change-this') {
    console.warn('⚠️  WARNING: Using default API key! Set API_KEY environment variable.');
  }

  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('⚠️  Google Maps API not configured. Only static database cities supported.');
    console.warn('   Set GOOGLE_MAPS_API_KEY environment variable to enable worldwide location lookup.');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});
