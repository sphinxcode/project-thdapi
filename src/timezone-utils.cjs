/**
 * Утилиты для работы с часовыми поясами
 * Определение UTC offset и DST для расчета времени рождения
 */

// Основные города и их часовые пояса
const CITY_TIMEZONES = {
  'Москва': { tz: 'Europe/Moscow', lat: 55.7558, lon: 37.6173 },
  'Санкт-Петербург': { tz: 'Europe/Moscow', lat: 59.9343, lon: 30.3351 },
  'Новосибирск': { tz: 'Asia/Novosibirsk', lat: 55.0084, lon: 82.9357 },
  'Екатеринбург': { tz: 'Asia/Yekaterinburg', lat: 56.8431, lon: 60.6454 },
  'Казань': { tz: 'Europe/Moscow', lat: 55.8304, lon: 49.0661 },
  'Нижний Новгород': { tz: 'Europe/Moscow', lat: 56.2965, lon: 43.9361 },
  'Киев': { tz: 'Europe/Kiev', lat: 50.4501, lon: 30.5234 },
  'Минск': { tz: 'Europe/Minsk', lat: 53.9045, lon: 27.5615 },
  'Алматы': { tz: 'Asia/Almaty', lat: 43.2389, lon: 76.8897 },
  'Ташкент': { tz: 'Asia/Tashkent', lat: 41.2995, lon: 69.2401 },
};

// UTC offsets по времени года (для упрощенной модели)
const TIMEZONE_OFFSETS = {
  'Europe/Moscow': {
    standard: 3, // UTC+3 зимой
    daylight: 3  // UTC+3 круглый год с 2014
  },
  'Asia/Yekaterinburg': {
    standard: 5,
    daylight: 5
  },
  'Asia/Novosibirsk': {
    standard: 7,
    daylight: 7
  },
  'Europe/Kiev': {
    standard: 2,
    daylight: 3
  },
  'Europe/Minsk': {
    standard: 3,
    daylight: 3
  },
  'Asia/Almaty': {
    standard: 6,
    daylight: 6
  },
  'Asia/Tashkent': {
    standard: 5,
    daylight: 5
  }
};

/**
 * Определить часовой пояс и координаты по названию города
 */
function getLocationInfo(cityName) {
  // Нормализация названия
  const normalized = cityName.toLowerCase().trim();
  
  // Поиск в кэше городов
  for (const [city, info] of Object.entries(CITY_TIMEZONES)) {
    if (city.toLowerCase().includes(normalized) || normalized.includes(city.toLowerCase())) {
      return { city, ...info };
    }
  }
  
  // Значения по умолчанию (Москва)
  console.warn(`Unknown city: ${cityName}, using Moscow defaults`);
  return CITY_TIMEZONES['Москва'];
}

/**
 * Определить UTC offset для даты (учитывая DST)
 * Упрощенная версия - для полной точности используйте библиотеку timezone
 */
function getUTCOffset(cityName, birthDate) {
  const [year, month, day] = birthDate.split('-').map(Number);
  const locationInfo = getLocationInfo(cityName);
  const timezone = locationInfo.tz;
  
  if (!TIMEZONE_OFFSETS[timezone]) {
    console.warn(`Unknown timezone: ${timezone}, using UTC+3`);
    return 3;
  }
  
  const offsets = TIMEZONE_OFFSETS[timezone];
  
  // Упрощенное определение DST
  // Летнее время обычно: март-октябрь (в Северном полушарии)
  const isDST = month >= 3 && month <= 10;
  
  // Некоторые страны отменили DST
  if (timezone === 'Europe/Moscow' && year >= 2014) {
    return 3; // После 2014 DST отменен в России
  }
  
  return isDST ? offsets.daylight : offsets.standard;
}

/**
 * Конвертировать local time в UTC
 */
function localTimeToUTC(localTime, utcOffset) {
  const [hour, minute] = localTime.split(':').map(Number);
  const utcHour = hour - utcOffset;
  
  // Обработка перехода через полуночь
  let adjustedHour = utcHour;
  if (adjustedHour < 0) adjustedHour += 24;
  if (adjustedHour >= 24) adjustedHour -= 24;
  
  return {
    hour: adjustedHour,
    minute: minute,
    offset: utcOffset
  };
}

/**
 * Конвертировать local time в UTC (с учетом даты)
 */
function convertToUTC(birthDate, birthTime, cityName) {
  const [year, month, day] = birthDate.split('-').map(Number);
  const utcOffset = getUTCOffset(cityName, birthDate);
  const { hour, minute } = localTimeToUTC(birthTime, utcOffset);
  
  return {
    utcYear: year,
    utcMonth: month,
    utcDay: day,
    utcHour: hour,
    utcMinute: minute,
    offset: utcOffset,
    originalLocalTime: birthTime
  };
}

module.exports = {
  getLocationInfo,
  getUTCOffset,
  localTimeToUTC,
  convertToUTC,
  CITY_TIMEZONES,
  TIMEZONE_OFFSETS
};

