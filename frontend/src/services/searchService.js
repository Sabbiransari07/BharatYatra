// src/services/searchService.js

import { apiGet } from "./api";

/**
 * Search Indian states, cities and destinations.
 *
 * Backend:
 * GET /api/search?query=...
 *
 * @param {string} query
 * @returns {Promise<object>}
 */
export async function searchDestinations(query) {
  const cleanQuery = String(query || "").trim();

  if (!cleanQuery) {
    throw new Error("Search query is required.");
  }

  if (cleanQuery.length < 2) {
    throw new Error("Please enter at least 2 characters.");
  }

  return apiGet(
    `/api/search?query=${encodeURIComponent(cleanQuery)}`
  );
}

/**
 * Search destinations and return only the result list.
 *
 * Useful for autocomplete/search suggestions.
 *
 * @param {string} query
 * @returns {Promise<Array>}
 */
export async function getSearchResults(query) {
  const data = await searchDestinations(query);

  return Array.isArray(data?.results)
    ? data.results
    : [];
}

/**
 * Search destination and select the best result
 * having valid latitude and longitude.
 *
 * @param {string} query
 * @returns {Promise<object>}
 */
export async function findDestination(query) {
  const data = await searchDestinations(query);

  if (
    !data?.success ||
    !Array.isArray(data.results) ||
    data.results.length === 0
  ) {
    throw new Error(
      data?.message || "No Indian destination found."
    );
  }

  const selected =
    data.results.find(
      (item) =>
        Number.isFinite(Number(item.latitude)) &&
        Number.isFinite(Number(item.longitude))
    ) || data.results[0];

  if (
    !Number.isFinite(Number(selected.latitude)) ||
    !Number.isFinite(Number(selected.longitude))
  ) {
    throw new Error(
      "Destination coordinates are invalid."
    );
  }

  return selected;
}

/**
 * Build a destination URL for React Router.
 *
 * Example:
 * /destination/Goa
 *
 * @param {string} query
 * @returns {string}
 */
export function createDestinationPath(query) {
  const cleanQuery = String(query || "").trim();

  if (!cleanQuery) {
    return "/dashboard";
  }

  return `/destination/${encodeURIComponent(
    cleanQuery
  )}`;
}