// src/services/destinationService.js

import { apiGet } from "./api";

/**
 * Get complete live information for a destination.
 *
 * Backend:
 * GET /api/destination?query=...&lat=...&lon=...
 *
 * @param {string} query
 * @param {number|string} latitude
 * @param {number|string} longitude
 * @returns {Promise<object>}
 */
export async function getDestinationData(
  query,
  latitude,
  longitude
) {
  const cleanQuery = String(query || "").trim();

  const lat = Number(latitude);
  const lon = Number(longitude);

  if (!cleanQuery) {
    throw new Error("Destination query is required.");
  }

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error(
      "Valid destination coordinates are required."
    );
  }

  const params = new URLSearchParams({
    query: cleanQuery,
    lat: String(lat),
    lon: String(lon),
  });

  return apiGet(
    `/api/destination?${params.toString()}`
  );
}

/**
 * Get destination data using a selected
 * search result object.
 *
 * Example:
 * {
 *   name: "Lucknow",
 *   latitude: 26.8467,
 *   longitude: 80.9462
 * }
 *
 * @param {object} destination
 * @returns {Promise<object>}
 */
export async function getDestinationByLocation(
  destination
) {
  if (!destination) {
    throw new Error("Destination is required.");
  }

  return getDestinationData(
    destination.name,
    destination.latitude,
    destination.longitude
  );
}

/**
 * Normalize destination API response.
 *
 * This keeps the frontend safe even if any
 * array is missing from the backend response.
 *
 * @param {object} data
 * @returns {object}
 */
export function normalizeDestinationData(data) {
  return {
    success: data?.success ?? false,

    destination: data?.destination || null,

    cities: Array.isArray(data?.cities)
      ? data.cities
      : [],

    attractions: Array.isArray(data?.attractions)
      ? data.attractions
      : [],

    food: Array.isArray(data?.food)
      ? data.food
      : [],

    stays: Array.isArray(data?.stays)
      ? data.stays
      : [],

    counts: {
      cities:
        Number(data?.counts?.cities) ||
        data?.cities?.length ||
        0,

      attractions:
        Number(data?.counts?.attractions) ||
        data?.attractions?.length ||
        0,

      food:
        Number(data?.counts?.food) ||
        data?.food?.length ||
        0,

      stays:
        Number(data?.counts?.stays) ||
        data?.stays?.length ||
        0,
    },

    source:
      data?.source ||
      "BharatYatra Live Tourism Data",

    liveDataAvailable:
      data?.liveDataAvailable ?? false,

    cached:
      data?.cached ?? false,

    message:
      data?.message || null,
  };
}

/**
 * Get complete normalized destination data.
 *
 * @param {string} query
 * @param {number|string} latitude
 * @param {number|string} longitude
 * @returns {Promise<object>}
 */
export async function loadDestination(
  query,
  latitude,
  longitude
) {
  const data = await getDestinationData(
    query,
    latitude,
    longitude
  );

  if (!data?.success) {
    throw new Error(
      data?.message ||
        "Unable to load destination information."
    );
  }

  return normalizeDestinationData(data);
}

/**
 * Get only cities from destination data.
 *
 * @param {string} query
 * @param {number|string} latitude
 * @param {number|string} longitude
 * @returns {Promise<Array>}
 */
export async function getDestinationCities(
  query,
  latitude,
  longitude
) {
  const data = await loadDestination(
    query,
    latitude,
    longitude
  );

  return data.cities;
}

/**
 * Get only tourist places.
 *
 * @param {string} query
 * @param {number|string} latitude
 * @param {number|string} longitude
 * @returns {Promise<Array>}
 */
export async function getTouristPlaces(
  query,
  latitude,
  longitude
) {
  const data = await loadDestination(
    query,
    latitude,
    longitude
  );

  return data.attractions;
}

/**
 * Get restaurants and cafes.
 *
 * @param {string} query
 * @param {number|string} latitude
 * @param {number|string} longitude
 * @returns {Promise<Array>}
 */
export async function getFoodPlaces(
  query,
  latitude,
  longitude
) {
  const data = await loadDestination(
    query,
    latitude,
    longitude
  );

  return data.food;
}

/**
 * Get hotels and accommodation.
 *
 * @param {string} query
 * @param {number|string} latitude
 * @param {number|string} longitude
 * @returns {Promise<Array>}
 */
export async function getStays(
  query,
  latitude,
  longitude
) {
  const data = await loadDestination(
    query,
    latitude,
    longitude
  );

  return data.stays;
}