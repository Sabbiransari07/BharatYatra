// src/hooks/useDestination.js

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  loadDestination,
} from "../services/destinationService";

/**
 * Hook for loading and managing
 * live destination data.
 *
 * @param {string} query
 * @param {number} latitude
 * @param {number} longitude
 * @param {boolean} autoLoad
 */
export default function useDestination(
  query,
  latitude,
  longitude,
  autoLoad = true
) {
  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  /**
   * Load destination data.
   */
  const fetchDestination =
    useCallback(async () => {
      const cleanQuery =
        String(query || "").trim();

      const lat = Number(latitude);
      const lon = Number(longitude);

      if (!cleanQuery) {
        setError(
          new Error(
            "Destination is required."
          )
        );
        return null;
      }

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lon)
      ) {
        setError(
          new Error(
            "Valid destination coordinates are required."
          )
        );
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const result =
          await loadDestination(
            cleanQuery,
            lat,
            lon
          );

        setData(result);

        return result;
      } catch (err) {
        const destinationError =
          err instanceof Error
            ? err
            : new Error(
                "Unable to load destination data."
              );

        setError(
          destinationError
        );

        setData(null);

        return null;
      } finally {
        setLoading(false);
      }
    }, [
      query,
      latitude,
      longitude,
    ]);

  /**
   * Automatically load when
   * destination changes.
   */
  useEffect(() => {
    if (!autoLoad) return;

    if (
      query &&
      Number.isFinite(Number(latitude)) &&
      Number.isFinite(Number(longitude))
    ) {
      fetchDestination();
    }
  }, [
    autoLoad,
    query,
    latitude,
    longitude,
    fetchDestination,
  ]);

  /**
   * Manually reload destination.
   */
  const reload = useCallback(() => {
    return fetchDestination();
  }, [fetchDestination]);

  /**
   * Clear destination data.
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  /**
   * Safe arrays for components.
   */
  const attractions =
    Array.isArray(data?.attractions)
      ? data.attractions
      : [];

  const food =
    Array.isArray(data?.food)
      ? data.food
      : [];

  const stays =
    Array.isArray(data?.stays)
      ? data.stays
      : [];

  const cities =
    Array.isArray(data?.cities)
      ? data.cities
      : [];

  return {
    data,

    destination:
      data?.destination || null,

    cities,
    attractions,
    food,
    stays,

    counts:
      data?.counts || {
        cities: cities.length,
        attractions:
          attractions.length,
        food: food.length,
        stays: stays.length,
      },

    source:
      data?.source || null,

    liveDataAvailable:
      data?.liveDataAvailable ?? false,

    cached:
      data?.cached ?? false,

    message:
      data?.message || null,

    loading,
    error,

    fetchDestination,
    reload,
    reset,
  };
}