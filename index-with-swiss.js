#!/usr/bin/env node

/**
 * MCP Server для Human Design с полной версией Swiss Ephemeris
 * Использует CommonJS модуль для совместимости с Swiss Ephemeris
 */

// Используем createRequire для импорта CommonJS модуля в ES module контексте
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema,
  ListToolsRequestSchema 
} from '@modelcontextprotocol/sdk/types.js';

// Импортируем полную версию с Swiss Ephemeris
const { calculateHumanDesign } = require('./src/calculations-cjs.cjs');

const server = new Server(
  {
    name: 'human-design-mcp-server-full',
    version: '1.0.0-full',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'calculate_human_design',
      description: 'Рассчитывает карту Human Design по дате, времени и месту рождения (полная версия с Swiss Ephemeris)',
      inputSchema: {
        type: 'object',
        properties: {
          birthDate: {
            type: 'string',
            description: 'Дата рождения в формате YYYY-MM-DD',
          },
          birthTime: {
            type: 'string',
            description: 'Время рождения в формате HH:MM',
          },
          birthLocation: {
            type: 'string',
            description: 'Место рождения (город, страна)',
          },
          latitude: {
            type: 'number',
            description: 'Широта места рождения (опционально)',
          },
          longitude: {
            type: 'number',
            description: 'Долгота места рождения (опционально)',
          },
        },
        required: ['birthDate', 'birthTime', 'birthLocation'],
      },
    },
    {
      name: 'get_human_design_definition',
      description: 'Получить определения и значения в Human Design',
      inputSchema: {
        type: 'object',
        properties: {
          component: {
            type: 'string',
            enum: ['type', 'authority', 'profile', 'gates', 'channels', 'centers'],
            description: 'Компонент Human Design для определения',
          },
        },
        required: ['component'],
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'calculate_human_design') {
      const result = await calculateHumanDesign({
        birthDate: args.birthDate,
        birthTime: args.birthTime,
        birthLocation: args.birthLocation,
        latitude: args.latitude,
        longitude: args.longitude,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    if (name === 'get_human_design_definition') {
      const definitions = await getHumanDesignDefinition(args.component);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(definitions, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Helper function for definitions
async function getHumanDesignDefinition(component) {
  const definitions = {
    type: {
      manifestor: {
        name: 'Манифестор',
        strategy: 'Информировать',
        authority: 'Следовать своей силе',
        description: 'Манифесторы имеют закрытую и авторитетную ауру. Они приходят в этот мир, чтобы инициировать и воздействовать на других людей.',
      },
      generator: {
        name: 'Генератор',
        strategy: 'Отвечать',
        authority: 'Следовать своему отклику',
        description: 'Генераторы обладают открытой и притягивающей аурой. Их цель - найти работу, которая приносит им удовольствие.',
      },
      manifesting_generator: {
        name: 'Манифестирующий Генератор',
        strategy: 'Отвечать и информировать',
        authority: 'Следовать своему отклику',
        description: 'Манифестирующие Генераторы сочетают энергию Генератора с возможностью инициировать, как Манифестор.',
      },
      projector: {
        name: 'Проектор',
        strategy: 'Ждать приглашения',
        authority: 'Ждать признания других',
        description: 'Проекторы имеют сосредоточенную ауру. Их задача - направлять и управлять энергией Генераторов и Манифесторов.',
      },
      reflector: {
        name: 'Рефлектор',
        strategy: 'Ждать полного лунного цикла',
        authority: 'Ждать 28 дней для принятия решений',
        description: 'Рефлекторы имеют устойчивую, отталкивающую ауру. Они отражают энергию окружающих людей.',
      },
    },
    authority: {
      emotional: {
        name: 'Эмоциональная',
        description: 'Ждите, пока эмоции не выровняются, прежде чем принимать решения.',
      },
      sacral: {
        name: 'Сакральная',
        description: 'Слушайте своё тело и следуйте своему отклику.',
      },
      splenic: {
        name: 'Селезеночная',
        description: 'Доверяйте первым инстинктам и интуиции.',
      },
      ego_manifested: {
        name: 'Проявленный Эго',
        description: 'Следуйте обещаниям и обязательствам.',
      },
      ego_projected: {
        name: 'Проецируемый Эго',
        description: 'Ждите приглашения или признания.',
      },
      g_center: {
        name: 'G-Центр',
        description: 'Следуйте направлению любви.',
      },
      no_inner_authority: {
        name: 'Без внутренней власти',
        description: 'Окружайте себя правильными людьми.',
      },
      lunar: {
        name: 'Лунная',
        description: 'Ждите полный лунный цикл.',
      },
    },
    centers: [
      { number: 1, name: 'Root', ru_name: 'Корневой', type: 'pressure' },
      { number: 2, name: 'Sacral', ru_name: 'Сакральный', type: 'motor' },
      { number: 3, name: 'Solar Plexus', ru_name: 'Солнечное сплетение', type: 'motor' },
      { number: 4, name: 'Heart', ru_name: 'Сердечный', type: 'motor' },
      { number: 5, name: 'Throat', ru_name: 'Горловой', type: 'output' },
      { number: 6, name: 'Ajna', ru_name: 'Аджана', type: 'awareness' },
      { number: 7, name: 'Head', ru_name: 'Головной', type: 'pressure' },
      { number: 8, name: 'Spleen', ru_name: 'Селезенка', type: 'awareness' },
      { number: 9, name: 'G', ru_name: 'G-центр', type: 'identity' },
    ],
  };

  return definitions[component] || { error: 'Unknown component' };
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Human Design MCP Server (Full Swiss Ephemeris) running on stdio');
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

