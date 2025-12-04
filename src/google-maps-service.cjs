/**
 * Google Maps Geocoding Service
 * Fallback location lookup when static database doesn't have the location
 */

const https = require('https');

/**
 * Get location info from Google Maps Geocoding API
 * @param {string} locationString - Location name (city, address, etc.)
 * @param {string} apiKey - Google Maps API key
 * @returns {Promise<{city: string, tz: string, lat: number, lon: number, formattedAddress: string}>}
 */
async function geocodeLocation(locationString, apiKey) {
  if (!apiKey) {
    throw new Error('Google Maps API key is required');
  }

  const encodedLocation = encodeURIComponent(locationString);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedLocation}&key=${apiKey}`;

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);

          if (response.status !== 'OK') {
            reject(new Error(`Geocoding failed: ${response.status} - ${response.error_message || 'Unknown error'}`));
            return;
          }

          if (!response.results || response.results.length === 0) {
            reject(new Error(`No results found for location: ${locationString}`));
            return;
          }

          const result = response.results[0];
          const location = result.geometry.location;

          resolve({
            city: extractCityName(result.address_components),
            lat: location.lat,
            lon: location.lng,
            formattedAddress: result.formatted_address,
            placeId: result.place_id
          });

        } catch (error) {
          reject(new Error(`Failed to parse geocoding response: ${error.message}`));
        }
      });

    }).on('error', (error) => {
      reject(new Error(`Geocoding request failed: ${error.message}`));
    });
  });
}

/**
 * Get timezone for coordinates using Google Maps Time Zone API
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} timestamp - Unix timestamp for the date
 * @param {string} apiKey - Google Maps API key
 * @returns {Promise<{timezone: string, offset: number, timezoneName: string}>}
 */
async function getTimezoneForCoordinates(lat, lon, timestamp, apiKey) {
  if (!apiKey) {
    throw new Error('Google Maps API key is required');
  }

  const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lon}&timestamp=${timestamp}&key=${apiKey}`;

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);

          if (response.status !== 'OK') {
            reject(new Error(`Timezone lookup failed: ${response.status} - ${response.errorMessage || 'Unknown error'}`));
            return;
          }

          // Calculate offset in hours (API returns seconds)
          const offsetHours = (response.rawOffset + response.dstOffset) / 3600;

          resolve({
            timezone: response.timeZoneId,
            offset: offsetHours,
            timezoneName: response.timeZoneName
          });

        } catch (error) {
          reject(new Error(`Failed to parse timezone response: ${error.message}`));
        }
      });

    }).on('error', (error) => {
      reject(new Error(`Timezone request failed: ${error.message}`));
    });
  });
}

/**
 * Complete location lookup with timezone
 * @param {string} locationString - Location name
 * @param {string} birthDate - Birth date (YYYY-MM-DD) for timezone calculation
 * @param {string} birthTime - Birth time (HH:MM) for accurate timezone/DST calculation
 * @param {string} apiKey - Google Maps API key
 * @returns {Promise<{city: string, tz: string, lat: number, lon: number, formattedAddress: string}>}
 */
async function getCompleteLocationInfo(locationString, birthDate, birthTime, apiKey) {
  // First geocode the location
  const geoResult = await geocodeLocation(locationString, apiKey);

  // Convert birth date+time to timestamp for timezone lookup
  // Use UTC to avoid server timezone affecting the timestamp
  const timestamp = Math.floor(new Date(`${birthDate}T${birthTime}:00Z`).getTime() / 1000);

  // Get timezone for the coordinates
  const tzResult = await getTimezoneForCoordinates(
    geoResult.lat,
    geoResult.lon,
    timestamp,
    apiKey
  );

  return {
    city: geoResult.city || locationString,
    tz: tzResult.timezone,
    lat: geoResult.lat,
    lon: geoResult.lon,
    formattedAddress: geoResult.formattedAddress,
    timezoneName: tzResult.timezoneName,
    offset: tzResult.offset
  };
}

/**
 * Extract city name from Google Maps address components
 */
function extractCityName(addressComponents) {
  // Try to find locality (city) first
  let city = addressComponents.find(c => c.types.includes('locality'));
  if (city) return city.long_name;

  // Fallback to administrative area
  city = addressComponents.find(c => c.types.includes('administrative_area_level_1'));
  if (city) return city.long_name;

  // Fallback to country
  city = addressComponents.find(c => c.types.includes('country'));
  if (city) return city.long_name;

  return 'Unknown';
}

module.exports = {
  geocodeLocation,
  getTimezoneForCoordinates,
  getCompleteLocationInfo
};
