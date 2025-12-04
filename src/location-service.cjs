/**
 * Hybrid Location Service
 * Tries static database first, falls back to Google Maps API
 */

const tzDB = require('./timezone-database.cjs');
const googleMaps = require('./google-maps-service.cjs');

// Cache for Google Maps lookups to avoid repeated API calls
const locationCache = new Map();

/**
 * Get location info with hybrid approach
 * 1. Try static database
 * 2. Check cache for previous Google Maps lookups
 * 3. Fall back to Google Maps API if enabled
 *
 * @param {string} locationString - Location name
 * @param {string} birthDate - Birth date (YYYY-MM-DD) for timezone calculation
 * @param {string} birthTime - Birth time (HH:MM) for accurate timezone/DST
 * @param {object} options - Optional configuration
 * @param {string} options.googleMapsApiKey - Google Maps API key (optional)
 * @param {boolean} options.useGoogleMaps - Whether to use Google Maps as fallback (default: true if API key provided)
 * @returns {Promise<{city: string, tz: string, lat: number, lon: number, source: string}>}
 */
async function getLocationInfo(locationString, birthDate, birthTime, options = {}) {
  const { googleMapsApiKey, useGoogleMaps = !!googleMapsApiKey } = options;

  // 1. Try static database first
  try {
    const result = tzDB.findTimezoneByCity(locationString);
    if (result && result.timezone) {
      return {
        city: result.city || locationString,
        tz: result.timezone,
        lat: result.latitude,
        lon: result.longitude,
        source: 'static-database'
      };
    }
  } catch (error) {
    // Static database lookup failed, continue to fallback
    console.log(`Static DB lookup failed for "${locationString}":`, error.message);
  }

  // 2. Check cache for previous Google Maps lookups
  const cacheKey = `${locationString.toLowerCase()}-${birthDate}-${birthTime}`;
  if (locationCache.has(cacheKey)) {
    const cached = locationCache.get(cacheKey);
    return {
      ...cached,
      source: 'cache'
    };
  }

  // 3. Fall back to Google Maps API if enabled
  if (useGoogleMaps && googleMapsApiKey) {
    try {
      const result = await googleMaps.getCompleteLocationInfo(
        locationString,
        birthDate,
        birthTime,
        googleMapsApiKey
      );

      const locationData = {
        city: result.city,
        tz: result.tz,
        lat: result.lat,
        lon: result.lon,
        formattedAddress: result.formattedAddress,
        timezoneName: result.timezoneName
      };

      // Cache the result
      locationCache.set(cacheKey, locationData);

      return {
        ...locationData,
        source: 'google-maps-api'
      };

    } catch (error) {
      throw new Error(`Location lookup failed: ${error.message}. Please provide latitude and longitude manually.`);
    }
  }

  // No Google Maps API available
  throw new Error(
    `Location "${locationString}" not found in database. ` +
    `Please provide latitude and longitude, or enable Google Maps API.`
  );
}

/**
 * Get UTC offset for a location
 * @param {string} locationString - Location name
 * @param {string} birthDate - Birth date (YYYY-MM-DD)
 * @param {string} birthTime - Birth time (HH:MM)
 * @param {object} options - Optional configuration
 * @returns {Promise<number>} UTC offset in hours
 */
async function getUTCOffset(locationString, birthDate, birthTime, options = {}) {
  const locationInfo = await getLocationInfo(locationString, birthDate, birthTime, options);

  // Try to get DST-aware offset from static database
  try {
    const offsetData = tzDB.getUTCOffsetWithDST(birthDate, locationInfo.tz);
    return offsetData.offset;
  } catch (error) {
    // Fallback to offset from location info
    return locationInfo.offset || 0;
  }
}

/**
 * Convert local time to UTC
 * @param {string} birthDate - Birth date (YYYY-MM-DD)
 * @param {string} birthTime - Birth time (HH:MM)
 * @param {string} locationString - Location name
 * @param {object} options - Optional configuration
 * @returns {Promise<object>} UTC date/time information
 */
async function convertToUTC(birthDate, birthTime, locationString, options = {}) {
  const locationInfo = await getLocationInfo(locationString, birthDate, birthTime, options);

  // Try static database conversion first (handles DST properly)
  try {
    const fullResult = tzDB.convertLocalToUTC(birthDate, birthTime, locationString);
    return {
      utcYear: fullResult.utcYear,
      utcMonth: fullResult.utcMonth,
      utcDay: fullResult.utcDay,
      utcHour: fullResult.utcHour,
      utcMinute: fullResult.utcMinute,
      offset: fullResult.localOffset,
      originalLocalTime: fullResult.originalLocalTime,
      source: 'static-database'
    };
  } catch (error) {
    // Fallback: Use same logic as static database for consistency
    // Manual calculation: UTC = LocalTime - Offset
    const offset = locationInfo.offset || 0;
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour, minute] = birthTime.split(':').map(Number);

    // Convert to UTC
    let utcHour = hour - offset;
    let utcDay = day;
    let utcMonth = month;
    let utcYear = year;

    // Handle day boundaries
    if (utcHour < 0) {
      utcHour += 24;
      utcDay--;
      if (utcDay < 1) {
        utcMonth--;
        if (utcMonth < 1) {
          utcMonth = 12;
          utcYear--;
        }
        // Get last day of previous month (utcMonth is 1-indexed)
        utcDay = new Date(utcYear, utcMonth, 0).getDate();
      }
    } else if (utcHour >= 24) {
      utcHour -= 24;
      utcDay++;
      // Get days in current month (utcMonth is 1-indexed)
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
      offset: offset,
      originalLocalTime: birthTime,
      source: 'google-maps-api'
    };
  }
}

/**
 * Clear the location cache (useful for testing or memory management)
 */
function clearCache() {
  locationCache.clear();
}

/**
 * Get cache statistics
 */
function getCacheStats() {
  return {
    size: locationCache.size,
    keys: Array.from(locationCache.keys())
  };
}

module.exports = {
  getLocationInfo,
  getUTCOffset,
  convertToUTC,
  clearCache,
  getCacheStats
};
