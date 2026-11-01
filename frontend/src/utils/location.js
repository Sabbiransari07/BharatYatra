// src/utils/location.js


// ======================================================
// Coordinate Validation
// ======================================================

export function isValidLatitude(
  latitude
) {
  const lat = Number(latitude);

  return (
    Number.isFinite(lat) &&
    lat >= -90 &&
    lat <= 90
  );
}


export function isValidLongitude(
  longitude
) {
  const lon = Number(longitude);

  return (
    Number.isFinite(lon) &&
    lon >= -180 &&
    lon <= 180
  );
}


export function isValidCoordinates(
  latitude,
  longitude
) {
  return (
    isValidLatitude(latitude) &&
    isValidLongitude(longitude)
  );
}


// ======================================================
// Normalize Coordinates
// ======================================================

export function normalizeCoordinates(
  latitude,
  longitude
) {
  const lat = Number(latitude);
  const lon = Number(longitude);

  if (
    !isValidCoordinates(lat, lon)
  ) {
    return null;
  }

  return {
    latitude: lat,
    longitude: lon,
  };
}


// ======================================================
// Distance — Haversine Formula
// ======================================================

export function calculateDistance(
  latitude1,
  longitude1,
  latitude2,
  longitude2
) {
  if (
    !isValidCoordinates(
      latitude1,
      longitude1
    ) ||
    !isValidCoordinates(
      latitude2,
      longitude2
    )
  ) {
    return null;
  }

  const earthRadius = 6371000;

  const lat1 =
    Number(latitude1) *
    (Math.PI / 180);

  const lat2 =
    Number(latitude2) *
    (Math.PI / 180);

  const deltaLat =
    (Number(latitude2) -
      Number(latitude1)) *
    (Math.PI / 180);

  const deltaLon =
    (Number(longitude2) -
      Number(longitude1)) *
    (Math.PI / 180);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
}


// ======================================================
// Distance in Kilometers
// ======================================================

export function calculateDistanceKm(
  latitude1,
  longitude1,
  latitude2,
  longitude2
) {
  const distanceInMeters =
    calculateDistance(
      latitude1,
      longitude1,
      latitude2,
      longitude2
    );

  if (distanceInMeters === null) {
    return null;
  }

  return distanceInMeters / 1000;
}


// ======================================================
// Distance in Miles
// ======================================================

export function calculateDistanceMiles(
  latitude1,
  longitude1,
  latitude2,
  longitude2
) {
  const distanceInKm =
    calculateDistanceKm(
      latitude1,
      longitude1,
      latitude2,
      longitude2
    );

  if (distanceInKm === null) {
    return null;
  }

  return distanceInKm * 0.621371;
}


// ======================================================
// Find Nearest Place
// ======================================================

export function findNearestPlace(
  currentLatitude,
  currentLongitude,
  places = []
) {
  if (
    !isValidCoordinates(
      currentLatitude,
      currentLongitude
    )
  ) {
    return null;
  }

  if (!Array.isArray(places)) {
    return null;
  }

  let nearestPlace = null;
  let shortestDistance = Infinity;

  places.forEach((place) => {
    const latitude =
      place?.latitude ??
      place?.lat;

    const longitude =
      place?.longitude ??
      place?.lon;

    const distance =
      calculateDistance(
        currentLatitude,
        currentLongitude,
        latitude,
        longitude
      );

    if (
      distance !== null &&
      distance < shortestDistance
    ) {
      shortestDistance = distance;
      nearestPlace = {
        ...place,
        distance,
      };
    }
  });

  return nearestPlace;
}


// ======================================================
// Filter Places by Radius
// ======================================================

export function filterPlacesByRadius(
  currentLatitude,
  currentLongitude,
  places = [],
  radiusInMeters = 5000
) {
  if (
    !isValidCoordinates(
      currentLatitude,
      currentLongitude
    )
  ) {
    return [];
  }

  if (!Array.isArray(places)) {
    return [];
  }

  const radius =
    Math.max(
      0,
      Number(radiusInMeters) || 0
    );

  return places
    .map((place) => {
      const latitude =
        place?.latitude ??
        place?.lat;

      const longitude =
        place?.longitude ??
        place?.lon;

      const distance =
        calculateDistance(
          currentLatitude,
          currentLongitude,
          latitude,
          longitude
        );

      if (distance === null) {
        return null;
      }

      return {
        ...place,
        distance,
      };
    })
    .filter(
      (place) =>
        place &&
        place.distance <= radius
    )
    .sort(
      (a, b) =>
        a.distance - b.distance
    );
}


// ======================================================
// Google Maps URL
// ======================================================

export function createGoogleMapsUrl(
  latitude,
  longitude
) {
  if (
    !isValidCoordinates(
      latitude,
      longitude
    )
  ) {
    return null;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${Number(latitude)},${Number(longitude)}`
  )}`;
}


// ======================================================
// OpenStreetMap URL
// ======================================================

export function createOpenStreetMapUrl(
  latitude,
  longitude,
  zoom = 15
) {
  if (
    !isValidCoordinates(
      latitude,
      longitude
    )
  ) {
    return null;
  }

  const safeZoom = Math.min(
    19,
    Math.max(1, Number(zoom) || 15)
  );

  return `https://www.openstreetmap.org/?mlat=${encodeURIComponent(
    latitude
  )}&mlon=${encodeURIComponent(
    longitude
  )}#map=${safeZoom}/${encodeURIComponent(
    latitude
  )}/${encodeURIComponent(
    longitude
  )}`;
}


// ======================================================
// Map Directions URL
// ======================================================

export function createDirectionsUrl(
  fromLatitude,
  fromLongitude,
  toLatitude,
  toLongitude
) {
  if (
    !isValidCoordinates(
      fromLatitude,
      fromLongitude
    ) ||
    !isValidCoordinates(
      toLatitude,
      toLongitude
    )
  ) {
    return null;
  }

  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    `${fromLatitude},${fromLongitude}`
  )}&destination=${encodeURIComponent(
    `${toLatitude},${toLongitude}`
  )}`;
}


// ======================================================
// Place Coordinates
// ======================================================

export function getPlaceCoordinates(
  place
) {
  if (!place) {
    return null;
  }

  const latitude =
    place.latitude ??
    place.lat;

  const longitude =
    place.longitude ??
    place.lon;

  return normalizeCoordinates(
    latitude,
    longitude
  );
}


// ======================================================
// India Coordinate Check
// ======================================================

export function isWithinIndia(
  latitude,
  longitude
) {
  if (
    !isValidCoordinates(
      latitude,
      longitude
    )
  ) {
    return false;
  }

  // Approximate geographical bounding box
  // for mainland India and nearby Indian
  // territories used by the application.
  return (
    Number(latitude) >= 6 &&
    Number(latitude) <= 37.5 &&
    Number(longitude) >= 68 &&
    Number(longitude) <= 97.5
  );
}


// ======================================================
// Location Object
// ======================================================

export function createLocationObject(
  latitude,
  longitude,
  extra = {}
) {
  const coordinates =
    normalizeCoordinates(
      latitude,
      longitude
    );

  if (!coordinates) {
    return null;
  }

  return {
    ...coordinates,
    ...extra,
  };
}