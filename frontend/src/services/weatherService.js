// src/services/weatherService.js

import { apiGet } from "./api";

/**
 * Get live weather for a location.
 *
 * Backend:
 * GET /api/weather?lat=...&lon=...
 *
 * @param {number|string} latitude
 * @param {number|string} longitude
 * @returns {Promise<object>}
 */
export async function getWeather(
  latitude,
  longitude
) {
  const lat = Number(latitude);
  const lon = Number(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error(
      "Valid latitude and longitude are required."
    );
  }

  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
  });

  return apiGet(
    `/api/weather?${params.toString()}`
  );
}

/**
 * Get weather and validate the response.
 *
 * @param {number|string} latitude
 * @param {number|string} longitude
 * @returns {Promise<object>}
 */
export async function loadWeather(
  latitude,
  longitude
) {
  const data = await getWeather(
    latitude,
    longitude
  );

  if (!data?.success) {
    throw new Error(
      data?.message ||
        "Unable to load weather information."
    );
  }

  return data;
}

/**
 * Get weather using a destination object.
 *
 * @param {object} destination
 * @returns {Promise<object>}
 */
export async function getWeatherForDestination(
  destination
) {
  if (!destination) {
    throw new Error("Destination is required.");
  }

  return loadWeather(
    destination.latitude,
    destination.longitude
  );
}

/**
 * Convert weather data into a safe frontend structure.
 *
 * @param {object} data
 * @returns {object}
 */
export function normalizeWeatherData(data) {
  const current = data?.current || {};
  const daily = data?.daily || {};

  return {
    success: data?.success ?? false,

    location: data?.location || null,

    current: {
      temperature:
        current.temperature ?? null,

      apparentTemperature:
        current.apparentTemperature ?? null,

      humidity:
        current.humidity ?? null,

      windSpeed:
        current.windSpeed ?? null,

      weatherCode:
        current.weatherCode ?? null,

      weatherDescription:
        current.weatherDescription ||
        "Weather information unavailable.",
    },

    daily: {
      time: Array.isArray(daily.time)
        ? daily.time
        : [],

      temperatureMax: Array.isArray(
        daily.temperatureMax
      )
        ? daily.temperatureMax
        : [],

      temperatureMin: Array.isArray(
        daily.temperatureMin
      )
        ? daily.temperatureMin
        : [],

      weatherCode: Array.isArray(
        daily.weatherCode
      )
        ? daily.weatherCode
        : [],

      precipitationProbability:
        Array.isArray(
          daily.precipitationProbability
        )
          ? daily.precipitationProbability
          : [],
    },

    source:
      data?.source ||
      "Open-Meteo",

    message:
      data?.message || null,
  };
}

/**
 * Get normalized weather data.
 *
 * @param {number|string} latitude
 * @param {number|string} longitude
 * @returns {Promise<object>}
 */
export async function getNormalizedWeather(
  latitude,
  longitude
) {
  const data = await loadWeather(
    latitude,
    longitude
  );

  return normalizeWeatherData(data);
}