// src/hooks/useWeather.js

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getNormalizedWeather,
} from "../services/weatherService";

/**
 * Hook for loading and managing
 * destination weather data.
 *
 * @param {number} latitude
 * @param {number} longitude
 * @param {boolean} autoLoad
 */
export default function useWeather(
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
   * Load weather data.
   */
  const fetchWeather =
    useCallback(async () => {
      const lat = Number(latitude);
      const lon = Number(longitude);

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lon)
      ) {
        setError(
          new Error(
            "Valid latitude and longitude are required."
          )
        );

        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const result =
          await getNormalizedWeather(
            lat,
            lon
          );

        setData(result);

        return result;
      } catch (err) {
        const weatherError =
          err instanceof Error
            ? err
            : new Error(
                "Unable to load weather information."
              );

        setError(weatherError);
        setData(null);

        return null;
      } finally {
        setLoading(false);
      }
    }, [latitude, longitude]);

  /**
   * Automatically load weather
   * when coordinates change.
   */
  useEffect(() => {
    if (!autoLoad) return;

    if (
      Number.isFinite(Number(latitude)) &&
      Number.isFinite(Number(longitude))
    ) {
      fetchWeather();
    }
  }, [
    autoLoad,
    latitude,
    longitude,
    fetchWeather,
  ]);

  /**
   * Manually refresh weather.
   */
  const reload = useCallback(() => {
    return fetchWeather();
  }, [fetchWeather]);

  /**
   * Clear weather state.
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  /**
   * Safe current weather object.
   */
  const current = data?.current || {
    temperature: null,
    apparentTemperature: null,
    humidity: null,
    windSpeed: null,
    weatherCode: null,
    weatherDescription:
      "Weather information unavailable.",
  };

  /**
   * Safe daily forecast.
   */
  const daily = data?.daily || {
    time: [],
    temperatureMax: [],
    temperatureMin: [],
    weatherCode: [],
    precipitationProbability: [],
  };

  return {
    data,

    location:
      data?.location || null,

    current,

    daily,

    source:
      data?.source || "Open-Meteo",

    message:
      data?.message || null,

    loading,

    error,

    fetchWeather,
    reload,
    reset,
  };
}