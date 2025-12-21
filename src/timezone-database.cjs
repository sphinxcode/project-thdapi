/**
 * Timezone database - Philippines only
 * All other locations use Google Maps API for accurate timezone data
 * Philippines does not observe DST, always UTC+8
 */

// IANA Timezone database - Philippines only
// All other locations will use Google Maps API for accurate timezone lookup
const TIMEZONE_DB = {
  // Philippines - Major cities
  'Asia/Manila': {
    offset: 8,
    lat: 14.5995,
    lon: 120.9842,
    cities: [
      'Manila', 'Манила',
      'Philippines', 'Филиппины',
      'Quezon City', 'Makati', 'Caloocan', 'Davao', 'Cebu',
      'Zamboanga', 'Taguig', 'Antipolo', 'Pasig', 'Cagayan de Oro',
      'Parañaque', 'Dasmariñas', 'Valenzuela', 'Bacoor', 'General Santos',
      'Las Piñas', 'Mandaluyong', 'Bacolod', 'Muntinlupa', 'San Jose del Monte',
      'Iloilo', 'Marikina', 'Pasay', 'Calamba', 'Baguio'
    ]
  },
};

// DST history - Philippines does not observe DST
const DST_HISTORY = {
  'Asia/Manila': {
    alwaysDST: false // Philippines never uses DST, always UTC+8
  }
};

/**
 * Найти timezone по названию города
 */
function findTimezoneByCity(cityName) {
  const normalized = cityName.toLowerCase().trim();

  for (const [tz, data] of Object.entries(TIMEZONE_DB)) {
    for (const city of data.cities) {
      if (city.toLowerCase() === normalized ||
        normalized.includes(city.toLowerCase()) ||
        city.toLowerCase().includes(normalized)) {
        return {
          timezone: tz,
          offset: data.offset,
          latitude: data.lat,
          longitude: data.lon,
          city: city
        };
      }
    }
  }

  // Не найдено - возвращаем null чтобы использовать Google Maps API
  console.log(`City not found in database: ${cityName}, will try Google Maps API`);
  return null;
}

/**
 * Определить, действует ли DST для даты
 */
function isDST(birthDate, timezone) {
  const [year, month, day] = birthDate.split('-').map(Number);
  const dstInfo = DST_HISTORY[timezone];

  if (!dstInfo) return false;

  // Специальные случаи
  if (timezone === 'Europe/Moscow') {
    return year < 2014; // DST отменен с 2014
  }

  if (!dstInfo.alwaysDST) return false;

  // Упрощенный расчет DST (март-октябрь для большинства стран)
  return month >= 3 && month <= 10;
}

/**
 * Получить UTC offset с учетом DST
 */
function getUTCOffsetWithDST(birthDate, timezone) {
  const baseInfo = TIMEZONE_DB[timezone] || TIMEZONE_DB['Europe/Moscow'];
  const dstActive = isDST(birthDate, timezone);

  return {
    offset: baseInfo.offset + (dstActive ? 1 : 0),
    dst: dstActive,
    timezone: timezone
  };
}

/**
 * Конвертировать local time в UTC
 */
function convertLocalToUTC(birthDate, birthTime, cityName) {
  // Найти timezone по городу
  const locationInfo = findTimezoneByCity(cityName);

  if (!locationInfo || !locationInfo.timezone) {
    // Город не найден - выбрасываем ошибку для использования Google Maps API
    throw new Error(`City not found in static database: ${cityName}`);
  }

  // Получить offset с DST
  const offsetData = getUTCOffsetWithDST(birthDate, locationInfo.timezone);

  // Парсинг времени
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hour, minute] = birthTime.split(':').map(Number);

  // Конвертация в UTC
  let utcHour = hour - offsetData.offset;
  let utcDay = day;
  let utcMonth = month;
  let utcYear = year;

  // Обработка перехода через границы дня
  if (utcHour < 0) {
    utcHour += 24;
    utcDay--;
    if (utcDay < 1) {
      utcMonth--;
      if (utcMonth < 1) {
        utcMonth = 12;
        utcYear--;
      }
      // FIXED: Use utcYear and utcMonth, not original year and month
      utcDay = new Date(utcYear, utcMonth, 0).getDate();
    }
  } else if (utcHour >= 24) {
    utcHour -= 24;
    utcDay++;
    // FIXED: Use utcYear and utcMonth, not original year and month
    const daysInMonth = new Date(utcYear, utcMonth, 0).getDate();
    if (utcDay > daysInMonth) {
      utcDay = 1;
      utcMonth++;
      if (utcMonth > 12) {
        utcMonth = 1;
        utcYear++;
      }
    }
  }

  return {
    utcYear,
    utcMonth,
    utcDay,
    utcHour,
    utcMinute: minute,
    originalLocalTime: birthTime,
    localTimezone: locationInfo.timezone,
    localOffset: offsetData.offset,
    dst: offsetData.dst,
    latitude: locationInfo.latitude,
    longitude: locationInfo.longitude
  };
}

module.exports = {
  TIMEZONE_DB,
  DST_HISTORY,
  findTimezoneByCity,
  isDST,
  getUTCOffsetWithDST,
  convertLocalToUTC
};
