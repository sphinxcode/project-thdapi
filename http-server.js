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
const { createCompositeChart } = require('./src/composite-transformers.cjs');
console.log('✅ Swiss Ephemeris version loaded');
console.log('✅ V1/V2 Response Transformers loaded');
console.log('✅ Composite Chart Transformer loaded');

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

// =============================================================================
// Composite Endpoint - Relationship Chart Analysis
// Merges two individual charts to show relationship dynamics
// =============================================================================
app.post('/api/v1/composite', authMiddleware, async (req, res) => {
  try {
    const {
      // Person A parameters
      date, timezone, location, latitude, longitude,
      // Person B parameters
      date1, timezone1, location1, latitude1, longitude1
    } = req.body;

    // Validation for Person A
    if (!date || !timezone) {
      return res.status(400).json({
        success: false,
        error: 'date and timezone are required for Person A',
      });
    }

    // Validation for Person B
    if (!date1 || !timezone1) {
      return res.status(400).json({
        success: false,
        error: 'date1 and timezone1 are required for Person B',
      });
    }

    // Parse ISO 8601 date/time for Person A
    const parsedDateA = new Date(date);
    if (isNaN(parsedDateA.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format for Person A. Use ISO 8601 format (e.g., 1981-03-16T13:01:00)',
      });
    }
    const birthDateA = parsedDateA.toISOString().split('T')[0];
    const birthTimeA = parsedDateA.toISOString().split('T')[1].substring(0, 5);

    // Parse ISO 8601 date/time for Person B
    const parsedDateB = new Date(date1);
    if (isNaN(parsedDateB.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format for Person B. Use ISO 8601 format (e.g., 1990-07-21T08:30:00)',
      });
    }
    const birthDateB = parsedDateB.toISOString().split('T')[0];
    const birthTimeB = parsedDateB.toISOString().split('T')[1].substring(0, 5);

    // Calculate Person A's chart
    const resultA = await calculateHumanDesign({
      birthDate: birthDateA,
      birthTime: birthTimeA,
      birthLocation: location || timezone, // Use timezone as location if not provided
      latitude,
      longitude,
      timezone,
      googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    // Calculate Person B's chart
    const resultB = await calculateHumanDesign({
      birthDate: birthDateB,
      birthTime: birthTimeB,
      birthLocation: location1 || timezone1,
      latitude: latitude1,
      longitude: longitude1,
      timezone: timezone1,
      googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    // Transform both to V1 format
    const v1A = transformToV1(resultA, false);
    const v1B = transformToV1(resultB, false);

    // Create composite chart
    const composite = createCompositeChart(resultA, resultB, v1A, v1B);

    res.json({
      success: true,
      meta: {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoint: 'v1-composite'
      },
      data: composite
    });
  } catch (error) {
    console.error('Error calculating Composite Chart:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// Composite Endpoint with Tooltips
// =============================================================================
app.post('/api/v1/composite-tooltip', authMiddleware, async (req, res) => {
  try {
    const {
      date, timezone, location, latitude, longitude,
      date1, timezone1, location1, latitude1, longitude1
    } = req.body;

    if (!date || !timezone) {
      return res.status(400).json({
        success: false,
        error: 'date and timezone are required for Person A',
      });
    }

    if (!date1 || !timezone1) {
      return res.status(400).json({
        success: false,
        error: 'date1 and timezone1 are required for Person B',
      });
    }

    const parsedDateA = new Date(date);
    if (isNaN(parsedDateA.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format for Person A. Use ISO 8601 format.',
      });
    }
    const birthDateA = parsedDateA.toISOString().split('T')[0];
    const birthTimeA = parsedDateA.toISOString().split('T')[1].substring(0, 5);

    const parsedDateB = new Date(date1);
    if (isNaN(parsedDateB.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format for Person B. Use ISO 8601 format.',
      });
    }
    const birthDateB = parsedDateB.toISOString().split('T')[0];
    const birthTimeB = parsedDateB.toISOString().split('T')[1].substring(0, 5);

    const resultA = await calculateHumanDesign({
      birthDate: birthDateA,
      birthTime: birthTimeA,
      birthLocation: location || timezone,
      latitude,
      longitude,
      timezone,
      googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    const resultB = await calculateHumanDesign({
      birthDate: birthDateB,
      birthTime: birthTimeB,
      birthLocation: location1 || timezone1,
      latitude: latitude1,
      longitude: longitude1,
      timezone: timezone1,
      googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    // Transform with tooltips
    const v1A = transformToV1(resultA, true);
    const v1B = transformToV1(resultB, true);

    const composite = createCompositeChart(resultA, resultB, v1A, v1B);

    res.json({
      success: true,
      meta: {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoint: 'v1-composite-tooltip'
      },
      data: composite
    });
  } catch (error) {
    console.error('Error calculating Composite Chart with tooltips:', error);
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
    version: '2.2.0',
    auth: 'Bearer token required',
    features: {
      staticDatabase: 'Major cities worldwide',
      googleMapsIntegration: GOOGLE_MAPS_API_KEY ? 'Enabled (fallback for unknown locations)' : 'Disabled',
      asteroids: 'Chiron, Ceres, Pallas, Juno, Vesta',
      chartAngles: 'AC, MC, IC, DC',
      compositeCharts: 'Relationship analysis with electromagnetic, compromise, dominance, companionship channels'
    },
    endpoints: {
      health: '/health (public)',
      v1: '/api/v1/data - Lean enterprise (empty tooltips)',
      v1Tooltip: '/api/v1/data-tooltip - Lean enterprise (full tooltips)',
      v2: '/api/v2/data - Full featured (empty tooltips)',
      v2Tooltip: '/api/v2/data-tooltip - Full featured (full tooltips)',
      composite: '/api/v1/composite - Relationship chart (empty tooltips)',
      compositeTooltip: '/api/v1/composite-tooltip - Relationship chart (full tooltips)',
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
