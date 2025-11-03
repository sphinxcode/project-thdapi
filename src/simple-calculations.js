/**
 * Упрощенная версия расчетов Human Design без Swiss Ephemeris
 * Для использования в n8n через Web API или упрощенные расчеты
 */

// 64 ворот (gates) в Human Design с маппингом на знаки
const GATES_BY_SIGN = {
  Aries: [1, 7, 13, 19, 25, 31, 37, 43, 49, 55, 61],
  Taurus: [2, 8, 14, 20, 26, 32, 38, 44, 50, 56, 62],
  Gemini: [3, 9, 15, 21, 27, 33, 39, 45, 51, 57, 63],
  Cancer: [4, 10, 16, 22, 28, 34, 40, 46, 52, 58, 64],
  Leo: [1, 7, 13, 19, 25, 31, 37, 43, 49, 55, 61],
  Virgo: [2, 8, 14, 20, 26, 32, 38, 44, 50, 56, 62],
  Libra: [3, 9, 15, 21, 27, 33, 39, 45, 51, 57, 63],
  Scorpio: [4, 10, 16, 22, 28, 34, 40, 46, 52, 58, 64],
  Sagittarius: [1, 7, 13, 19, 25, 31, 37, 43, 49, 55, 61],
  Capricorn: [2, 8, 14, 20, 26, 32, 38, 44, 50, 56, 62],
  Aquarius: [3, 9, 15, 21, 27, 33, 39, 45, 51, 57, 63],
  Pisces: [4, 10, 16, 22, 28, 34, 40, 46, 52, 58, 64],
};

// Маппинг знаков зодиака
const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// 64 ворот Human Design
const GATES = {
  1: { name: 'The Creative', ru_name: 'Творческий' },
  2: { name: 'The Receptive', ru_name: 'Воспринимающий' },
  3: { name: 'Ordering', ru_name: 'Порядок' },
  4: { name: 'Formulization', ru_name: 'Формулирование' },
  5: { name: 'Needing', ru_name: 'Потребность' },
  6: { name: 'Friction', ru_name: 'Трение' },
  7: { name: 'The Role of Self', ru_name: 'Роль Я' },
  8: { name: 'Holding Together', ru_name: 'Удержание вместе' },
  9: { name: 'The Focus', ru_name: 'Фокус' },
  10: { name: 'The Treading', ru_name: 'Шаги' },
  11: { name: 'Ideas', ru_name: 'Идеи' },
  12: { name: 'Caution', ru_name: 'Осторожность' },
  13: { name: 'The Listener', ru_name: 'Слушатель' },
  14: { name: 'Power Skills', ru_name: 'Силовые навыки' },
  15: { name: 'Modesty', ru_name: 'Скромность' },
  16: { name: 'Skills', ru_name: 'Навыки' },
  17: { name: 'Following', ru_name: 'Следование' },
  18: { name: 'Work', ru_name: 'Работа' },
  19: { name: 'Approach', ru_name: 'Подход' },
  20: { name: 'Now', ru_name: 'Сейчас' },
  21: { name: 'The Editor', ru_name: 'Редактор' },
  22: { name: 'Openness', ru_name: 'Открытость' },
  23: { name: 'Splitting Apart', ru_name: 'Распад' },
  24: { name: 'Rationalizing', ru_name: 'Рационализация' },
  25: { name: 'Spirit of the Self', ru_name: 'Дух Я' },
  26: { name: 'The Transmitter', ru_name: 'Передатчик' },
  27: { name: 'Caring', ru_name: 'Забота' },
  28: { name: 'The Game Player', ru_name: 'Игрок' },
  29: { name: 'Saying Yes', ru_name: 'Говорить да' },
  30: { name: 'Recognition of Feelings', ru_name: 'Узнавание чувств' },
  31: { name: 'Influence', ru_name: 'Влияние' },
  32: { name: 'The Duration', ru_name: 'Продолжительность' },
  33: { name: 'Retreat', ru_name: 'Отступление' },
  34: { name: 'Great Power', ru_name: 'Большая сила' },
  35: { name: 'Progress', ru_name: 'Прогресс' },
  36: { name: 'Crisis', ru_name: 'Кризис' },
  37: { name: 'Friendship', ru_name: 'Дружба' },
  38: { name: 'The Fighter', ru_name: 'Боец' },
  39: { name: 'Provocation', ru_name: 'Провокация' },
  40: { name: 'Deliverance', ru_name: 'Освобождение' },
  41: { name: 'Contraction', ru_name: 'Сокращение' },
  42: { name: 'Growth', ru_name: 'Рост' },
  43: { name: 'Insight', ru_name: 'Инсайт' },
  44: { name: 'Coming to Meet', ru_name: 'Встреча' },
  45: { name: 'The Gatherer', ru_name: 'Собирающий' },
  46: { name: 'Determination', ru_name: 'Определенность' },
  47: { name: 'Realization', ru_name: 'Реализация' },
  48: { name: 'The Well', ru_name: 'Колодец' },
  49: { name: 'Revolution', ru_name: 'Революция' },
  50: { name: 'Values', ru_name: 'Ценности' },
  51: { name: 'The Arousing', ru_name: 'Побуждение' },
  52: { name: 'Keeping Still', ru_name: 'Сохранение покоя' },
  53: { name: 'Development', ru_name: 'Развитие' },
  54: { name: 'The Marrying Maiden', ru_name: 'Невеста' },
  55: { name: 'Abundance', ru_name: 'Изобилие' },
  56: { name: 'The Wanderer', ru_name: 'Странник' },
  57: { name: 'The Gentle', ru_name: 'Нежный' },
  58: { name: 'The Joyous', ru_name: 'Радостный' },
  59: { name: 'Dispersion', ru_name: 'Дисперсия' },
  60: { name: 'Limitation', ru_name: 'Ограничение' },
  61: { name: 'Inner Truth', ru_name: 'Внутренняя правда' },
  62: { name: 'Detail', ru_name: 'Деталь' },
  63: { name: 'After Completion', ru_name: 'После завершения' },
  64: { name: 'Before Completion', ru_name: 'До завершения' },
};

// Центры и их ворота
const CENTER_GATES = {
  Root: [19, 39, 52, 58],
  Sacral: [2, 14, 26, 30, 31, 38, 42, 45, 59],
  SolarPlexus: [10, 20, 29, 34, 40, 46, 50, 57],
  Heart: [10, 21, 26, 34, 40, 51],
  Throat: [2, 3, 5, 7, 10, 11, 12, 16, 17, 20, 21, 22, 23, 24, 28, 31, 33, 35, 45, 56, 62],
  Ajna: [9, 20, 23, 30, 34, 40, 43, 47, 60, 61, 63, 64],
  Head: [1, 7, 13, 26, 27, 44, 50, 64],
  Spleen: [28, 32, 44, 48, 50, 57, 58],
  GCenter: [1, 2, 7, 10, 13, 15, 25, 46],
};

/**
 * Простая функция расчета Human Design используя внешний API
 * или упрощенные расчеты для демонстрации
 */
export async function calculateHumanDesignSimple({
  birthDate,
  birthTime,
  birthLocation,
  latitude,
  longitude,
}) {
  try {
    // Для реального использования рекомендуется использовать внешний API
    // например, https://api.humanapi.co или аналогичный
    
    // Пример ответа
    const birthDateObj = new Date(`${birthDate}T${birthTime}`);
    const randomGates = generateGatesForDate(birthDateObj);
    
    const type = determineTypeSimple(randomGates);
    const profile = determineProfileSimple(birthDateObj);
    const authority = determineAuthoritySimple(randomGates);
    const strategy = getStrategyForType(type);
    const definedCenters = getDefinedCentersSimple(randomGates);
    
    return {
      birthDate,
      birthTime,
      birthLocation,
      type,
      strategy,
      authority,
      profile,
      gates: randomGates,
      definedCenters,
      calculationSource: 'Simplified Version',
    };
  } catch (error) {
    console.error('Error calculating Human Design:', error);
    throw new Error(`Failed to calculate Human Design: ${error.message}`);
  }
}

/**
 * Генерация ворот на основе даты для демонстрации
 */
function generateGatesForDate(date) {
  const seed = date.getTime();
  const gates = [];
  const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Rahu', 'Ketu'];
  
  planets.forEach((planet, index) => {
    const randomGate = ((seed % 64) + index * 7) % 64 + 1;
    gates.push({
      planet: planet,
      gate: randomGate,
      line: (Math.floor(seed / 1000) % 6) + 1,
      name: GATES[randomGate].name,
      ru_name: GATES[randomGate].ru_name,
    });
  });
  
  return gates;
}

/**
 * Определение типа (упрощенная версия)
 */
function determineTypeSimple(gates) {
  const gateNumbers = gates.map(g => g.gate);
  
  const sacralGates = CENTER_GATES.Sacral;
  const throatGates = CENTER_GATES.Throat;
  const solarPlexusGates = CENTER_GATES.SolarPlexus;
  
  const hasSacral = sacralGates.some(g => gateNumbers.includes(g));
  const hasThroat = throatGates.some(g => gateNumbers.includes(g));
  const hasSolarPlexus = solarPlexusGates.some(g => gateNumbers.includes(g));
  
  if (hasSacral && hasThroat) {
    return { name: 'Manifesting Generator', ru_name: 'Манифестирующий Генератор' };
  }
  if (hasSacral) {
    return { name: 'Generator', ru_name: 'Генератор' };
  }
  if (!hasThroat) {
    return { name: 'Reflector', ru_name: 'Рефлектор' };
  }
  if (hasSolarPlexus) {
    return { name: 'Projector', ru_name: 'Проектор' };
  }
  return { name: 'Manifestor', ru_name: 'Манифестор' };
}

/**
 * Определение профиля (упрощенная версия)
 */
function determineProfileSimple(date) {
  const sunLine = (date.getDay() % 6) + 1;
  const earthLine = 7 - sunLine;
  
  return {
    number: `${sunLine}/${earthLine}`,
    description: `Профиль ${sunLine}/${earthLine}`,
  };
}

/**
 * Определение авторитета (упрощенная версия)
 */
function determineAuthoritySimple(gates) {
  const gateNumbers = gates.map(g => g.gate);
  
  const solarPlexusGates = CENTER_GATES.SolarPlexus;
  const sacralGates = CENTER_GATES.Sacral;
  const splenicGates = CENTER_GATES.Spleen;
  
  if (solarPlexusGates.some(g => gateNumbers.includes(g))) {
    return { name: 'Emotional', ru_name: 'Эмоциональная авторитет' };
  }
  if (sacralGates.some(g => gateNumbers.includes(g))) {
    return { name: 'Sacral', ru_name: 'Сакральная авторитет' };
  }
  if (splenicGates.some(g => gateNumbers.includes(g))) {
    return { name: 'Splenic', ru_name: 'Селезеночная авторитет' };
  }
  
  return { name: 'Sacral', ru_name: 'Сакральная авторитет' };
}

/**
 * Получить стратегию для типа
 */
function getStrategyForType(type) {
  const strategies = {
    'Manifestor': 'Информировать',
    'Generator': 'Отвечать',
    'Manifesting Generator': 'Отвечать и информировать',
    'Projector': 'Ждать приглашения',
    'Reflector': 'Ждать полного лунного цикла',
  };
  return strategies[type.name] || 'Отвечать';
}

/**
 * Получить определенные центры (упрощенная версия)
 */
function getDefinedCentersSimple(gates) {
  const gateNumbers = gates.map(g => g.gate);
  const defined = [];
  
  for (const [centerName, gates] of Object.entries(CENTER_GATES)) {
    if (gates.some(g => gateNumbers.includes(g))) {
      defined.push({
        name: centerName,
        defined: true,
      });
    }
  }
  
  return defined;
}

