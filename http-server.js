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
const { getMoonTransitRange, getAllPlanetsTransitRange, HD_PLANET_ORDER } = require('./src/transit-calculations.cjs');
console.log('✅ Swiss Ephemeris version loaded');
console.log('✅ V1/V2 Response Transformers loaded');
console.log('✅ Composite Chart Transformer loaded');
console.log('✅ Transit Calculations loaded');

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
    version: '2.3.0',
    timestamp: new Date().toISOString(),
    auth: 'enabled',
    features: {
      staticDatabase: true,
      googleMapsIntegration: !!GOOGLE_MAPS_API_KEY,
      transitEndpoints: true
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
// V3 Endpoint - True Inner Authority (Nodal Exclusion)
// Philosophy: Nodes (Rahu/Ketu) represent environment, trajectory, karmic
// lessons - NOT inner decision-making mechanics. When a channel has a gate
// activated EXCLUSIVELY by nodes, that channel is excluded from Type/Authority.
// =============================================================================
app.post('/api/v3/data', authMiddleware, async (req, res) => {
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

    // Transform to V2 format (without tooltips) as the base
    const v2Result = transformToV2(fullResult, false);

    // Add V3 True Inner Authority data
    const v3Result = {
      ...v2Result,
      // Override chart with V3 Type/Authority
      chart: {
        ...v2Result.chart,
        type: fullResult.trueInnerAuthority.v3Type,
        authority: fullResult.trueInnerAuthority.v3Authority,
        // Keep standard values for reference
        standardType: fullResult.trueInnerAuthority.v2Type,
        standardAuthority: fullResult.trueInnerAuthority.v2Authority,
      },
      // Include detailed True Inner Authority analysis
      trueInnerAuthority: fullResult.trueInnerAuthority,
      // Include gate activations map for transparency
      gateActivations: fullResult.gateActivations,
    };

    res.json({
      success: true,
      meta: {
        version: '3.0.0',
        concept: 'True Inner Authority',
        timestamp: new Date().toISOString(),
        endpoint: 'v3'
      },
      data: v3Result,
    });
  } catch (error) {
    console.error('Error calculating Human Design (V3):', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// V3 Endpoint with Tooltips - True Inner Authority + Full Tooltips
// =============================================================================
app.post('/api/v3/data-tooltip', authMiddleware, async (req, res) => {
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

    // Transform to V2 format WITH tooltips as the base
    const v2Result = transformToV2(fullResult, true);

    // Add V3 True Inner Authority data
    const v3Result = {
      ...v2Result,
      chart: {
        ...v2Result.chart,
        type: fullResult.trueInnerAuthority.v3Type,
        authority: fullResult.trueInnerAuthority.v3Authority,
        standardType: fullResult.trueInnerAuthority.v2Type,
        standardAuthority: fullResult.trueInnerAuthority.v2Authority,
      },
      trueInnerAuthority: fullResult.trueInnerAuthority,
      gateActivations: fullResult.gateActivations,
    };

    res.json({
      success: true,
      meta: {
        version: '3.0.0',
        concept: 'True Inner Authority',
        timestamp: new Date().toISOString(),
        endpoint: 'v3-tooltip'
      },
      data: v3Result,
    });
  } catch (error) {
    console.error('Error calculating Human Design (V3-tooltip):', error);
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
      // Person A parameters (same as v1 API)
      birthDate, birthTime, birthLocation, latitude, longitude,
      // Person B parameters
      birthDate1, birthTime1, birthLocation1, latitude1, longitude1
    } = req.body;

    // Validation for Person A
    if (!birthDate || !birthTime || !birthLocation) {
      return res.status(400).json({
        success: false,
        error: 'birthDate, birthTime, and birthLocation are required for Person A',
      });
    }

    // Validation for Person B
    if (!birthDate1 || !birthTime1 || !birthLocation1) {
      return res.status(400).json({
        success: false,
        error: 'birthDate1, birthTime1, and birthLocation1 are required for Person B',
      });
    }

    // Calculate Person A's chart
    const resultA = await calculateHumanDesign({
      birthDate,
      birthTime,
      birthLocation,
      latitude,
      longitude,
      googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    // Calculate Person B's chart
    const resultB = await calculateHumanDesign({
      birthDate: birthDate1,
      birthTime: birthTime1,
      birthLocation: birthLocation1,
      latitude: latitude1,
      longitude: longitude1,
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
      birthDate, birthTime, birthLocation, latitude, longitude,
      birthDate1, birthTime1, birthLocation1, latitude1, longitude1
    } = req.body;

    if (!birthDate || !birthTime || !birthLocation) {
      return res.status(400).json({
        success: false,
        error: 'birthDate, birthTime, and birthLocation are required for Person A',
      });
    }

    if (!birthDate1 || !birthTime1 || !birthLocation1) {
      return res.status(400).json({
        success: false,
        error: 'birthDate1, birthTime1, and birthLocation1 are required for Person B',
      });
    }

    const resultA = await calculateHumanDesign({
      birthDate,
      birthTime,
      birthLocation,
      latitude,
      longitude,
      googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    const resultB = await calculateHumanDesign({
      birthDate: birthDate1,
      birthTime: birthTime1,
      birthLocation: birthLocation1,
      latitude: latitude1,
      longitude: longitude1,
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

// =============================================================================
// Transit Endpoints - Universal planetary positions (no birth data needed)
// =============================================================================

/**
 * GET /api/transit/moon-range
 * Get Moon transit positions over a date range
 *
 * Query Parameters:
 * - startDate (required): ISO date string (YYYY-MM-DD)
 * - endDate (required): ISO date string (YYYY-MM-DD)
 * - granularity (optional): "daily" | "hourly" - defaults to "daily"
 *
 * Returns array of Moon positions with gate, line, color, tone, sign
 */
app.get('/api/transit/moon-range', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, granularity = 'daily' } = req.query;

    // Validation
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'startDate and endDate query parameters are required',
        example: '/api/transit/moon-range?startDate=2024-01-01&endDate=2024-01-07'
      });
    }

    // Validate date format
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Use ISO format: YYYY-MM-DD'
      });
    }

    // Validate granularity
    if (granularity !== 'daily' && granularity !== 'hourly') {
      return res.status(400).json({
        success: false,
        error: 'granularity must be "daily" or "hourly"'
      });
    }

    // Calculate transits
    const transits = await getMoonTransitRange(startDate, endDate, granularity);

    res.json({
      success: true,
      meta: {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoint: 'transit/moon-range',
        planet: 'Moon',
        startDate,
        endDate,
        granularity,
        count: transits.length,
        note: 'Moon transits through all 64 gates in ~28 days, spending ~10-11 hours per gate'
      },
      data: transits
    });

  } catch (error) {
    console.error('Error calculating Moon transit range:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/transit-range
 * Get all 13 Human Design planets' transit positions over a date range
 *
 * Query Parameters:
 * - startDate (required): ISO date string (YYYY-MM-DD)
 * - endDate (required): ISO date string (YYYY-MM-DD)
 * - granularity (optional): "daily" | "hourly" - defaults to "daily"
 *
 * Returns array of all planet positions with gate, line, color, tone, sign
 */
app.get('/api/transit-range', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, granularity = 'daily' } = req.query;

    // Validation
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'startDate and endDate query parameters are required',
        example: '/api/transit-range?startDate=2024-01-01&endDate=2024-01-07'
      });
    }

    // Validate date format
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Use ISO format: YYYY-MM-DD'
      });
    }

    // Validate granularity
    if (granularity !== 'daily' && granularity !== 'hourly') {
      return res.status(400).json({
        success: false,
        error: 'granularity must be "daily" or "hourly"'
      });
    }

    // Calculate transits
    const transits = await getAllPlanetsTransitRange(startDate, endDate, granularity);

    res.json({
      success: true,
      meta: {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoint: 'transit-range',
        planets: HD_PLANET_ORDER,
        startDate,
        endDate,
        granularity,
        count: transits.length,
        note: 'All 13 Human Design planets: Sun, Earth, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, Rahu (North Node), Ketu (South Node)'
      },
      data: transits
    });

  } catch (error) {
    console.error('Error calculating all planets transit range:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Human Design MCP Server',
    version: '4.0.0',
    auth: 'Bearer token required',
    features: {
      staticDatabase: 'Major cities worldwide',
      googleMapsIntegration: GOOGLE_MAPS_API_KEY ? 'Enabled (fallback for unknown locations)' : 'Disabled',
      asteroids: 'Chiron, Ceres, Pallas, Juno, Vesta',
      chartAngles: 'AC, MC, IC, DC',
      compositeCharts: 'Relationship analysis with electromagnetic, compromise, dominance, companionship channels',
      transits: 'Universal planetary transit positions over date ranges',
      trueInnerAuthority: 'V3 endpoint with nodal exclusion logic for Type/Authority calculation'
    },
    endpoints: {
      health: '/health (public)',
      v1: '/api/v1/data - Lean enterprise (empty tooltips)',
      v1Tooltip: '/api/v1/data-tooltip - Lean enterprise (full tooltips)',
      v2: '/api/v2/data - Full featured (empty tooltips)',
      v2Tooltip: '/api/v2/data-tooltip - Full featured (full tooltips)',
      v3: '/api/v3/data - True Inner Authority (nodal exclusion)',
      v3Tooltip: '/api/v3/data-tooltip - True Inner Authority (full tooltips)',
      composite: '/api/v1/composite - Relationship chart (empty tooltips)',
      compositeTooltip: '/api/v1/composite-tooltip - Relationship chart (full tooltips)',
      transitMoonRange: 'GET /api/transit/moon-range - Moon transits over date range',
      transitRange: 'GET /api/transit-range - All 13 planets transits over date range',
      legacy: '/api/human-design - Original format',
      mcp: '/api/mcp/calculate',
    },
    v3Concept: {
      name: 'True Inner Authority',
      philosophy: 'Nodes (Rahu/Ketu) represent environment, trajectory, and karmic lessons - NOT inner decision-making',
      rule: 'Gates activated EXCLUSIVELY by nodes are excluded from Type/Authority calculation',
      centersStillDefine: 'Nodal channels still define centers for conditioning awareness',
      typeCanChange: 'Type may change (e.g., Generator with only nodal Sacral becomes Reflector)'
    },
    transitEndpoints: {
      moonRange: {
        method: 'GET',
        path: '/api/transit/moon-range',
        params: 'startDate, endDate (required), granularity (optional: daily|hourly)',
        example: '/api/transit/moon-range?startDate=2024-01-01&endDate=2024-01-07&granularity=daily'
      },
      allPlanets: {
        method: 'GET',
        path: '/api/transit-range',
        params: 'startDate, endDate (required), granularity (optional: daily|hourly)',
        example: '/api/transit-range?startDate=2024-01-01&endDate=2024-01-07',
        planets: ['Sun', 'Earth', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Rahu', 'Ketu']
      }
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
