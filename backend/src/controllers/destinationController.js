import getPlaces from "../services/external/placesService.js";

const cache = new Map();

const CACHE_TTL = 10 * 60 * 1000;

function createCacheKey(
  query,
  latitude,
  longitude
) {
  return `${query
    .trim()
    .toLowerCase()}-${latitude.toFixed(
    4
  )}-${longitude.toFixed(4)}`;
}

function cleanFeature(feature) {
  const properties =
    feature.properties || {};

  const coordinates =
    feature.geometry?.coordinates || [];

  return {
    id:
      properties.place_id ||
      `${properties.name}-${coordinates.join("-")}`,

    name:
      properties.name ||
      properties.address_line1 ||
      "Unknown",

    latitude:
      properties.lat ??
      coordinates[1],

    longitude:
      properties.lon ??
      coordinates[0],

    category:
      properties.categories?.[0] ||
      null,

    address:
      properties.address_line2 ||
      properties.address_line1 ||
      properties.formatted ||
      null,

    website:
      properties.website ||
      null,

    phone:
      properties.contact?.phone ||
      properties.phone ||
      null,

    openingHours:
      properties.opening_hours ||
      null,

    distance:
      properties.distance ??
      null,

    datasource:
      properties.datasource ||
      null,
  };
}

async function fetchCategory({
  latitude,
  longitude,
  categories,
  limit,
}) {
  try {
    const data = await getPlaces({
      latitude,
      longitude,
      categories,
      limit,
      radius: 30000,
    });

    return (data.features || []).map(
      cleanFeature
    );
  } catch (error) {
    console.error(
      `Geoapify ${categories} Error:`,
      error.message
    );

    return [];
  }
}

export const getDestinationData = async (
  req,
  res
) => {
  try {
    const query = String(
      req.query.query || ""
    ).trim();

    const latitude = Number(
      req.query.lat
    );

    const longitude = Number(
      req.query.lon
    );

    if (!query) {
      return res.status(400).json({
        success: false,
        message:
          "Destination query is required",
      });
    }

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid latitude and longitude are required",
      });
    }

    const key = createCacheKey(
      query,
      latitude,
      longitude
    );

    // ---------------------------
    // CACHE
    // ---------------------------

    const cached = cache.get(key);

    if (
      cached &&
      Date.now() - cached.createdAt <
        CACHE_TTL
    ) {
      console.log(
        `Destination cache hit: ${query}`
      );

      return res.json({
        ...cached.data,
        cached: true,
      });
    }

    console.log(
      `Loading destination: ${query}`
    );

    // ---------------------------
    // LIVE PLACES
    // ---------------------------

    const [
      attractions,
      food,
      stays,
    ] = await Promise.all([
      fetchCategory({
        latitude,
        longitude,

        categories:
          "tourism,tourism.attraction,tourism.sights,entertainment,leisure",

        limit: 30,
      }),

      fetchCategory({
        latitude,
        longitude,

        categories:
          "catering.restaurant,catering.cafe,catering.fast_food,catering.ice_cream",

        limit: 30,
      }),

      fetchCategory({
        latitude,
        longitude,

        categories:
          "accommodation.hotel,accommodation.guest_house,accommodation.hostel,accommodation.motel,accommodation.apartment",

        limit: 30,
      }),
    ]);

    const liveDataAvailable =
      attractions.length > 0 ||
      food.length > 0 ||
      stays.length > 0;

    // ---------------------------
    // RESPONSE
    // ---------------------------

    const data = {
      success: true,

      destination: {
        name: query,
        latitude,
        longitude,
      },

      cities: [],

      attractions,

      food,

      stays,

      counts: {
        attractions:
          attractions.length,

        food:
          food.length,

        stays:
          stays.length,
      },

      source:
        "Geoapify Places API / OpenStreetMap",

      liveDataAvailable,

      message: liveDataAvailable
        ? null
        : "No live places were found near this destination.",
    };

    // ---------------------------
    // SAVE CACHE
    // ---------------------------

    cache.set(key, {
      createdAt: Date.now(),
      data,
    });

    // Keep cache small
    if (cache.size > 100) {
      const oldest =
        cache.keys().next().value;

      cache.delete(oldest);
    }

    return res.json(data);
  } catch (error) {
    console.error(
      "Destination Controller Error:",
      error.message
    );

    return res.status(200).json({
      success: true,

      destination: {
        name:
          req.query.query || "Destination",

        latitude:
          Number(req.query.lat),

        longitude:
          Number(req.query.lon),
      },

      cities: [],

      attractions: [],

      food: [],

      stays: [],

      counts: {
        attractions: 0,
        food: 0,
        stays: 0,
      },

      source:
        "Geoapify Places API / OpenStreetMap",

      liveDataAvailable: false,

      message:
        "Live destination data is temporarily unavailable.",
    });
  }
};