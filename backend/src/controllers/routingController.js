import calculateRoute from "../services/external/routingService.js";

const isValidCoordinate = (value, min, max) => {
  const number = Number(value);

  return (
    Number.isFinite(number) &&
    number >= min &&
    number <= max
  );
};

export const getRoute = async (req, res) => {
  try {
    const {
      fromLat,
      fromLon,
      toLat,
      toLon,
      mode = "drive",
    } = req.query;

    // Validate current location
    if (
      !isValidCoordinate(fromLat, -90, 90) ||
      !isValidCoordinate(fromLon, -180, 180)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid current location coordinates.",
      });
    }

    // Validate destination
    if (
      !isValidCoordinate(toLat, -90, 90) ||
      !isValidCoordinate(toLon, -180, 180)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid destination coordinates.",
      });
    }

    const route = await calculateRoute({
      fromLatitude: Number(fromLat),
      fromLongitude: Number(fromLon),
      toLatitude: Number(toLat),
      toLongitude: Number(toLon),
      mode,
    });

    const feature = route?.features?.[0];

    if (!feature) {
      return res.status(404).json({
        success: false,
        message: "No route could be calculated.",
      });
    }

    const properties = feature.properties || {};

    const distanceMeters = Number(
      properties.distance || 0
    );

    const durationSeconds = Number(
      properties.time || 0
    );

    return res.json({
      success: true,

      route: {
        type: "Feature",
        geometry: feature.geometry,
      },

      distance: {
        meters: distanceMeters,
        kilometers: Number(
          (distanceMeters / 1000).toFixed(2)
        ),
      },

      duration: {
        seconds: durationSeconds,
        minutes: Math.ceil(
          durationSeconds / 60
        ),
      },

      mode,

      source: "Geoapify Routing API",
    });
  } catch (error) {
    console.error(
      "Routing Controller Error:",
      error.message
    );

    return res.status(502).json({
      success: false,
      message:
        "Unable to calculate route right now.",
    });
  }
};