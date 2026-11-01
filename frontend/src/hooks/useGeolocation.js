// src/hooks/useGeolocation.js

import {
  useCallback,
  useEffect,
  useState,
} from "react";

export default function useGeolocation(
  autoRequest = false
) {
  const [location, setLocation] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [permission, setPermission] =
    useState("prompt");

  // Get current browser location
  const getCurrentLocation =
    useCallback(() => {
      if (!navigator.geolocation) {
        const errorMessage =
          "Geolocation is not supported by this browser.";

        setError(errorMessage);
        setPermission("denied");

        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const {
            latitude,
            longitude,
            accuracy,
          } = position.coords;

          setLocation({
            latitude,
            longitude,
            accuracy,
          });

          setPermission("granted");
          setLoading(false);
        },

        (positionError) => {
          let message =
            "Unable to get your current location.";

          if (
            positionError.code ===
            positionError.PERMISSION_DENIED
          ) {
            message =
              "Location permission was denied.";

            setPermission("denied");
          } else if (
            positionError.code ===
            positionError.POSITION_UNAVAILABLE
          ) {
            message =
              "Your current location is unavailable.";
          } else if (
            positionError.code ===
            positionError.TIMEOUT
          ) {
            message =
              "Location request timed out.";
          }

          setError(message);
          setLoading(false);
        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    }, []);

  // Automatically request location
  // if autoRequest = true
  useEffect(() => {
    if (autoRequest) {
      getCurrentLocation();
    }
  }, [
    autoRequest,
    getCurrentLocation,
  ]);

  // Clear location
  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
  }, []);

  // Check browser location permission
  const checkPermission =
    useCallback(async () => {
      if (!navigator.permissions) {
        return "prompt";
      }

      try {
        const result =
          await navigator.permissions.query({
            name: "geolocation",
          });

        setPermission(result.state);

        return result.state;
      } catch {
        return permission;
      }
    }, [permission]);

  return {
    location,

    latitude:
      location?.latitude ?? null,

    longitude:
      location?.longitude ?? null,

    accuracy:
      location?.accuracy ?? null,

    loading,

    error,

    permission,

    getCurrentLocation,

    clearLocation,

    checkPermission,

    hasLocation:
      Boolean(location),
  };
}