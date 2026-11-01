import { useEffect, useState } from "react";

export default function LiveLocation({ onLocationChange }) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        setLocation(currentLocation);
        setError("");

        if (onLocationChange) {
          onLocationChange(currentLocation);
        }
      },
      (error) => {
        console.error("Location error:", error);

        if (error.code === 1) {
          setError("Location permission denied.");
        } else if (error.code === 2) {
          setError("Unable to determine your location.");
        } else if (error.code === 3) {
          setError("Location request timed out.");
        } else {
          setError("Unable to get your live location.");
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [onLocationChange]);

  if (error) {
    return (
      <div className="live-location-error">
        📍 {error}
      </div>
    );
  }

  if (!location) {
    return (
      <div className="live-location-loading">
        📍 Getting your live location...
      </div>
    );
  }

  return (
    <div className="live-location-status">
      <span className="live-location-dot" />
      <div>
        <strong>Live Location</strong>
        <small>
          Accuracy: approximately{" "}
          {Math.round(location.accuracy)} m
        </small>
      </div>
    </div>
  );
}