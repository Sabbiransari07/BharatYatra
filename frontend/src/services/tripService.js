// src/services/tripService.js

import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
} from "./api";

/**
 * Get all trips of the logged-in user.
 *
 * Backend:
 * GET /api/trips
 */
export async function getTrips() {
  return apiGet("/api/trips");
}

/**
 * Get one trip by ID.
 *
 * Backend:
 * GET /api/trips/:id
 *
 * @param {string} tripId
 */
export async function getTripById(tripId) {
  if (!tripId) {
    throw new Error("Trip ID is required.");
  }

  return apiGet(
    `/api/trips/${encodeURIComponent(tripId)}`
  );
}

/**
 * Create a new trip.
 *
 * Backend:
 * POST /api/trips
 *
 * @param {object} tripData
 */
export async function createTrip(tripData) {
  if (!tripData || typeof tripData !== "object") {
    throw new Error("Trip data is required.");
  }

  if (!tripData.destination) {
    throw new Error("Trip destination is required.");
  }

  return apiPost("/api/trips", tripData);
}

/**
 * Update an existing trip.
 *
 * Backend:
 * PUT /api/trips/:id
 *
 * @param {string} tripId
 * @param {object} tripData
 */
export async function updateTrip(
  tripId,
  tripData
) {
  if (!tripId) {
    throw new Error("Trip ID is required.");
  }

  if (!tripData || typeof tripData !== "object") {
    throw new Error("Trip data is required.");
  }

  return apiPut(
    `/api/trips/${encodeURIComponent(tripId)}`,
    tripData
  );
}

/**
 * Delete a trip.
 *
 * Backend:
 * DELETE /api/trips/:id
 *
 * @param {string} tripId
 */
export async function deleteTrip(tripId) {
  if (!tripId) {
    throw new Error("Trip ID is required.");
  }

  return apiDelete(
    `/api/trips/${encodeURIComponent(tripId)}`
  );
}

/**
 * Add an itinerary item to a trip.
 *
 * Backend:
 * POST /api/trips/:id/itinerary
 *
 * @param {string} tripId
 * @param {object} itineraryItem
 */
export async function addItineraryItem(
  tripId,
  itineraryItem
) {
  if (!tripId) {
    throw new Error("Trip ID is required.");
  }

  if (
    !itineraryItem ||
    typeof itineraryItem !== "object"
  ) {
    throw new Error(
      "Itinerary item is required."
    );
  }

  return apiPost(
    `/api/trips/${encodeURIComponent(
      tripId
    )}/itinerary`,
    itineraryItem
  );
}

/**
 * Update an itinerary item.
 *
 * Backend:
 * PUT /api/trips/:id/itinerary/:itemId
 *
 * @param {string} tripId
 * @param {string} itemId
 * @param {object} itineraryItem
 */
export async function updateItineraryItem(
  tripId,
  itemId,
  itineraryItem
) {
  if (!tripId) {
    throw new Error("Trip ID is required.");
  }

  if (!itemId) {
    throw new Error(
      "Itinerary item ID is required."
    );
  }

  return apiPut(
    `/api/trips/${encodeURIComponent(
      tripId
    )}/itinerary/${encodeURIComponent(itemId)}`,
    itineraryItem
  );
}

/**
 * Remove an itinerary item.
 *
 * Backend:
 * DELETE /api/trips/:id/itinerary/:itemId
 *
 * @param {string} tripId
 * @param {string} itemId
 */
export async function deleteItineraryItem(
  tripId,
  itemId
) {
  if (!tripId) {
    throw new Error("Trip ID is required.");
  }

  if (!itemId) {
    throw new Error(
      "Itinerary item ID is required."
    );
  }

  return apiDelete(
    `/api/trips/${encodeURIComponent(
      tripId
    )}/itinerary/${encodeURIComponent(itemId)}`
  );
}

/**
 * Save/update the budget of a trip.
 *
 * Backend:
 * PUT /api/trips/:id/budget
 *
 * @param {string} tripId
 * @param {object} budget
 */
export async function saveTripBudget(
  tripId,
  budget
) {
  if (!tripId) {
    throw new Error("Trip ID is required.");
  }

  if (!budget || typeof budget !== "object") {
    throw new Error("Budget data is required.");
  }

  return apiPut(
    `/api/trips/${encodeURIComponent(
      tripId
    )}/budget`,
    budget
  );
}

/**
 * Mark a trip as completed.
 *
 * Backend:
 * PUT /api/trips/:id/complete
 *
 * @param {string} tripId
 */
export async function completeTrip(tripId) {
  if (!tripId) {
    throw new Error("Trip ID is required.");
  }

  return apiPut(
    `/api/trips/${encodeURIComponent(
      tripId
    )}/complete`,
    {}
  );
}