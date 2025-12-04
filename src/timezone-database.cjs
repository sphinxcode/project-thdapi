/**
 * Полная база данных timezone для всех городов мира
 * Для использования в n8n без внешних зависимостей
 */

// IANA Timezone и их часовые пояса
const TIMEZONE_DB = {
  // Россия
  'Europe/Moscow': { offset: 3, lat: 55.7558, lon: 37.6173, cities: ['Москва', 'Moscow'] },
  'Asia/Yekaterinburg': { offset: 5, lat: 56.8431, lon: 60.6454, cities: ['Екатеринбург', 'Ekaterinburg'] },
  'Asia/Omsk': { offset: 6, lat: 54.9885, lon: 73.3242, cities: ['Омск', 'Omsk'] },
  'Asia/Novosibirsk': { offset: 7, lat: 55.0084, lon: 82.9357, cities: ['Новосибирск', 'Novosibirsk'] },
  'Asia/Krasnoyarsk': { offset: 7, lat: 56.0184, lon: 92.8672, cities: ['Красноярск', 'Krasnoyarsk'] },
  'Asia/Irkutsk': { offset: 8, lat: 52.2980, lon: 104.2966, cities: ['Иркутск', 'Irkutsk'] },
  'Asia/Yakutsk': { offset: 9, lat: 62.0281, lon: 129.7326, cities: ['Якутск', 'Yakutsk'] },
  'Asia/Vladivostok': { offset: 10, lat: 43.1155, lon: 131.8855, cities: ['Владивосток', 'Vladivostok'] },
  'Asia/Magadan': { offset: 11, lat: 59.5590, lon: 150.8038, cities: ['Магадан', 'Magadan'] },
  'Asia/Kamchatka': { offset: 12, lat: 53.0436, lon: 158.6508, cities: ['Петропавловск-Камчатский', 'Petropavlovsk-Kamchatsky'] },
  
  // Европа
  'Europe/Kiev': { offset: 2, lat: 50.4501, lon: 30.5234, cities: ['Киев', 'Kiev', 'Kyiv'] },
  'Europe/Minsk': { offset: 3, lat: 53.9045, lon: 27.5615, cities: ['Минск', 'Minsk'] },
  'Europe/Warsaw': { offset: 1, lat: 52.2297, lon: 21.0122, cities: ['Варшава', 'Warsaw'] },
  'Europe/Prague': { offset: 1, lat: 50.0755, lon: 14.4378, cities: ['Прага', 'Prague'] },
  'Europe/Budapest': { offset: 1, lat: 47.4979, lon: 19.0402, cities: ['Будапешт', 'Budapest'] },
  'Europe/Berlin': { offset: 1, lat: 52.5200, lon: 13.4050, cities: ['Берлин', 'Berlin'] },
  'Europe/Paris': { offset: 1, lat: 48.8566, lon: 2.3522, cities: ['Париж', 'Paris'] },
  'Europe/London': { offset: 0, lat: 51.5074, lon: -0.1278, cities: ['Лондон', 'London'] },
  'Europe/Rome': { offset: 1, lat: 41.9028, lon: 12.4964, cities: ['Рим', 'Rome'] },
  'Europe/Madrid': { offset: 1, lat: 40.4168, lon: -3.7038, cities: ['Мадрид', 'Madrid'] },
  'Europe/Amsterdam': { offset: 1, lat: 52.3676, lon: 4.9041, cities: ['Амстердам', 'Amsterdam'] },
  'Europe/Brussels': { offset: 1, lat: 50.8503, lon: 4.3517, cities: ['Брюссель', 'Brussels'] },
  'Europe/Vienna': { offset: 1, lat: 48.2082, lon: 16.3738, cities: ['Вена', 'Vienna'] },
  'Europe/Athens': { offset: 2, lat: 37.9838, lon: 23.7275, cities: ['Афины', 'Athens'] },
  'Europe/Istanbul': { offset: 3, lat: 41.0082, lon: 28.9784, cities: ['Стамбул', 'Istanbul', 'Ankara', 'Анкара', 'Turkey', 'Турция', 'Izmir', 'Izmit', 'Bursa'] },
  'Europe/Stockholm': { offset: 1, lat: 59.3293, lon: 18.0686, cities: ['Стокгольм', 'Stockholm'] },
  'Europe/Oslo': { offset: 1, lat: 59.9139, lon: 10.7522, cities: ['Осло', 'Oslo'] },
  'Europe/Copenhagen': { offset: 1, lat: 55.6761, lon: 12.5683, cities: ['Копенгаген', 'Copenhagen'] },
  'Europe/Helsinki': { offset: 2, lat: 60.1699, lon: 24.9384, cities: ['Хельсинки', 'Helsinki'] },
  'Europe/Dublin': { offset: 0, lat: 53.3498, lon: -6.2603, cities: ['Дублин', 'Dublin'] },
  'Europe/Lisbon': { offset: 0, lat: 38.7223, lon: -9.1393, cities: ['Лиссабон', 'Lisbon'] },
  
  // Азия - Восточная и Юго-Восточная
  'Asia/Manila': { offset: 8, lat: 14.5995, lon: 120.9842, cities: ['Manila', 'Манила', 'Philippines', 'Филиппины'] },
  'Asia/Shanghai': { offset: 8, lat: 31.2304, lon: 121.4737, cities: ['Шанхай', 'Shanghai', 'Пекин', 'Beijing'] },
  'Asia/Hong_Kong': { offset: 8, lat: 22.3193, lon: 114.1694, cities: ['Гонконг', 'Hong Kong'] },
  'Asia/Tokyo': { offset: 9, lat: 35.6762, lon: 139.6503, cities: ['Токио', 'Tokyo'] },
  'Asia/Seoul': { offset: 9, lat: 37.5665, lon: 126.9780, cities: ['Сеул', 'Seoul'] },
  'Asia/Bangkok': { offset: 7, lat: 13.7563, lon: 100.5018, cities: ['Бангкок', 'Bangkok', 'Thailand', 'Таиланд'] },
  'Asia/Ho_Chi_Minh': { offset: 7, lat: 10.7769, lon: 106.7009, cities: ['Хошимин', 'Ho Chi Minh', 'Saigon', 'Vietnam', 'Вьетнам'] },
  'Asia/Jakarta': { offset: 7, lat: -6.2088, lon: 106.8456, cities: ['Джакарта', 'Jakarta', 'Indonesia', 'Индонезия'] },
  'Asia/Singapore': { offset: 8, lat: 1.3521, lon: 103.8198, cities: ['Сингапур', 'Singapore'] },
  'Asia/Kuala_Lumpur': { offset: 8, lat: 3.1390, lon: 101.6869, cities: ['Куала-Лумпур', 'Kuala Lumpur', 'Malaysia', 'Малайзия'] },
  'Asia/Taipei': { offset: 8, lat: 25.0330, lon: 121.5654, cities: ['Тайбэй', 'Taipei', 'Taiwan', 'Тайвань'] },
  
  // Азия - Центральная и Средняя
  'Asia/Almaty': { offset: 6, lat: 43.2389, lon: 76.8897, cities: ['Алматы', 'Almaty'] },
  'Asia/Tashkent': { offset: 5, lat: 41.2995, lon: 69.2401, cities: ['Ташкент', 'Tashkent'] },
  'Asia/Bishkek': { offset: 6, lat: 42.8746, lon: 74.5698, cities: ['Бишкек', 'Bishkek'] },
  'Asia/Dushanbe': { offset: 5, lat: 38.5598, lon: 68.7870, cities: ['Душанбе', 'Dushanbe'] },
  'Asia/Ashgabat': { offset: 5, lat: 37.9601, lon: 58.3261, cities: ['Ашхабад', 'Ashgabat'] },
  
  // Азия - Ближний Восток
  'Asia/Tbilisi': { offset: 4, lat: 41.7151, lon: 44.8271, cities: ['Тбилиси', 'Tbilisi'] },
  'Asia/Yerevan': { offset: 4, lat: 40.1811, lon: 44.5136, cities: ['Ереван', 'Yerevan'] },
  'Asia/Baku': { offset: 4, lat: 40.4093, lon: 49.8671, cities: ['Баку', 'Baku'] },
  'Asia/Dubai': { offset: 4, lat: 25.2048, lon: 55.2708, cities: ['Дубай', 'Dubai', 'UAE', 'ОАЭ'] },
  'Asia/Tel_Aviv': { offset: 2, lat: 32.0853, lon: 34.7818, cities: ['Тель-Авив', 'Tel Aviv', 'Israel', 'Израиль'] },
  'Asia/Jerusalem': { offset: 2, lat: 31.7683, lon: 35.2137, cities: ['Иерусалим', 'Jerusalem'] },
  'Asia/Beirut': { offset: 2, lat: 33.8886, lon: 35.4955, cities: ['Бейрут', 'Beirut', 'Lebanon', 'Ливан'] },
  'Asia/Riyadh': { offset: 3, lat: 24.7136, lon: 46.6753, cities: ['Эр-Рияд', 'Riyadh', 'Saudi Arabia', 'Саудовская Аравия'] },
  'Asia/Kuwait': { offset: 3, lat: 29.3759, lon: 47.9774, cities: ['Кувейт', 'Kuwait'] },
  'Asia/Baghdad': { offset: 3, lat: 33.3152, lon: 44.3661, cities: ['Багдад', 'Baghdad', 'Iraq', 'Ирак'] },
  'Asia/Tehran': { offset: 3.5, lat: 35.6892, lon: 51.3890, cities: ['Тегеран', 'Tehran', 'Iran', 'Иран'] },
  
  // Азия - Южная
  'Asia/Mumbai': { offset: 5.5, lat: 19.0760, lon: 72.8777, cities: ['Мумбаи', 'Mumbai', 'Бомбей', 'Bombay'] },
  'Asia/Kolkata': { offset: 5.5, lat: 22.5726, lon: 88.3639, cities: ['Калькутта', 'Kolkata', 'Calcutta'] },
  'Asia/Delhi': { offset: 5.5, lat: 28.6139, lon: 77.2090, cities: ['Дели', 'Delhi', 'New Delhi', 'Нью-Дели'] },
  'Asia/Bangalore': { offset: 5.5, lat: 12.9716, lon: 77.5946, cities: ['Бангалор', 'Bangalore', 'Bengaluru'] },
  'Asia/Chennai': { offset: 5.5, lat: 13.0827, lon: 80.2707, cities: ['Ченнаи', 'Chennai', 'Madras'] },
  'Asia/Kathmandu': { offset: 5.75, lat: 27.7172, lon: 85.3240, cities: ['Катманду', 'Kathmandu', 'Nepal', 'Непал'] },
  'Asia/Dhaka': { offset: 6, lat: 23.8103, lon: 90.4125, cities: ['Дакка', 'Dhaka', 'Bangladesh', 'Бангладеш'] },
  'Asia/Karachi': { offset: 5, lat: 24.8607, lon: 67.0011, cities: ['Карачи', 'Karachi', 'Pakistan', 'Пакистан'] },
  'Asia/Colombo': { offset: 5.5, lat: 6.9271, lon: 79.8612, cities: ['Коломбо', 'Colombo', 'Sri Lanka', 'Шри-Ланка'] },
  
  // Африка
  'Africa/Cairo': { offset: 2, lat: 30.0444, lon: 31.2357, cities: ['Каир', 'Cairo', 'Egypt', 'Египет'] },
  'Africa/Lagos': { offset: 1, lat: 6.5244, lon: 3.3792, cities: ['Лагос', 'Lagos', 'Nigeria', 'Нигерия'] },
  'Africa/Johannesburg': { offset: 2, lat: -26.2041, lon: 28.0473, cities: ['Йоханнесбург', 'Johannesburg', 'South Africa', 'ЮАР'] },
  'Africa/Nairobi': { offset: 3, lat: -1.2864, lon: 36.8172, cities: ['Найроби', 'Nairobi', 'Kenya', 'Кения'] },
  'Africa/Casablanca': { offset: 0, lat: 33.5731, lon: -7.5898, cities: ['Касабланка', 'Casablanca', 'Morocco', 'Марокко'] },
  'Africa/Algiers': { offset: 1, lat: 36.7538, lon: 3.0588, cities: ['Алжир', 'Algiers', 'Algeria'] },
  
  // Северная Америка
  'America/New_York': { offset: -5, lat: 40.7128, lon: -74.0060, cities: ['Нью-Йорк', 'New York', 'NYC'] },
  'America/Chicago': { offset: -6, lat: 41.8781, lon: -87.6298, cities: ['Чикаго', 'Chicago'] },
  'America/Denver': { offset: -7, lat: 39.7392, lon: -104.9903, cities: ['Денвер', 'Denver'] },
  'America/Los_Angeles': { offset: -8, lat: 34.0522, lon: -118.2437, cities: ['Лос-Анджелес', 'Los Angeles', 'LA'] },
  'America/Phoenix': { offset: -7, lat: 33.4484, lon: -112.0740, cities: ['Финикс', 'Phoenix'] },
  'America/Toronto': { offset: -5, lat: 43.6532, lon: -79.3832, cities: ['Торонто', 'Toronto', 'Canada', 'Канада'] },
  'America/Vancouver': { offset: -8, lat: 49.2827, lon: -123.1207, cities: ['Ванкувер', 'Vancouver'] },
  'America/Montreal': { offset: -5, lat: 45.5017, lon: -73.5673, cities: ['Монреаль', 'Montreal'] },
  'America/Mexico_City': { offset: -6, lat: 19.4326, lon: -99.1332, cities: ['Мехико', 'Mexico City', 'Mexico', 'Мексика'] },
  'America/Havana': { offset: -5, lat: 23.1136, lon: -82.3666, cities: ['Гавана', 'Havana', 'Cuba', 'Куба'] },
  
  // Южная Америка
  'America/Sao_Paulo': { offset: -3, lat: -23.5505, lon: -46.6333, cities: ['Сан-Паулу', 'Sao Paulo', 'Brazil', 'Бразилия'] },
  'America/Buenos_Aires': { offset: -3, lat: -34.6118, lon: -58.3960, cities: ['Буэнос-Айрес', 'Buenos Aires', 'Argentina', 'Аргентина'] },
  'America/Lima': { offset: -5, lat: -12.0464, lon: -77.0428, cities: ['Лима', 'Lima', 'Peru', 'Перу'] },
  'America/Bogota': { offset: -5, lat: 4.7110, lon: -74.0721, cities: ['Богота', 'Bogota', 'Colombia', 'Колумбия'] },
  'America/Santiago': { offset: -4, lat: -33.4489, lon: -70.6693, cities: ['Сантьяго', 'Santiago', 'Chile', 'Чили'] },
  
  // Австралия и Океания
  'Australia/Sydney': { offset: 10, lat: -33.8688, lon: 151.2093, cities: ['Сидней', 'Sydney'] },
  'Australia/Melbourne': { offset: 10, lat: -37.8136, lon: 144.9631, cities: ['Мельбурн', 'Melbourne'] },
  'Australia/Brisbane': { offset: 10, lat: -27.4698, lon: 153.0251, cities: ['Брисбен', 'Brisbane'] },
  'Australia/Perth': { offset: 8, lat: -31.9505, lon: 115.8605, cities: ['Перт', 'Perth'] },
  'Pacific/Auckland': { offset: 12, lat: -36.8485, lon: 174.7633, cities: ['Окленд', 'Auckland', 'New Zealand', 'Новая Зеландия'] },
};

// История изменения DST для key стран
const DST_HISTORY = {
  'Europe/Moscow': {
    // Россия отменила DST в 2014 году
    before2014: true, // было летнее время
    after2014: false  // отменено
  },
  'Europe/Kiev': {
    // Украина использует DST
    alwaysDST: true,
    dstStart: { month: 3, week: 'last', day: 0 }, // последнее воскресенье марта
    dstEnd: { month: 10, week: 'last', day: 0 }   // последнее воскресенье октября
  },
  'Europe/Berlin': {
    alwaysDST: true,
    dstStart: { month: 3, week: 'last', day: 0 },
    dstEnd: { month: 10, week: 'last', day: 0 }
  },
  'Europe/Paris': {
    alwaysDST: true,
    dstStart: { month: 3, week: 'last', day: 0 },
    dstEnd: { month: 10, week: 'last', day: 0 }
  },
  'America/New_York': {
    alwaysDST: true,
    dstStart: { month: 3, week: 'second', day: 0 }, // второе воскресенье марта
    dstEnd: { month: 11, week: 'first', day: 0 }     // первое воскресенье ноября
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
      utcDay = new Date(year, month, 0).getDate();
      if (utcMonth < 1) {
        utcMonth = 12;
        utcYear--;
      }
    }
  } else if (utcHour >= 24) {
    utcHour -= 24;
    utcDay++;
    const daysInMonth = new Date(year, month, 0).getDate();
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
