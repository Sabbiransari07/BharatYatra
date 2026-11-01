const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org/search";

/* -----------------------------------------
   Nominatim Search
----------------------------------------- */

export const fetchNominatim = async (
  query,
  limit = 8
) => {
  const url = new URL(NOMINATIM_URL);

  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("countrycodes", "in");
  url.searchParams.set("q", query);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent":
        "BharatYatra/1.0 (student-innovation-project)",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Nominatim API returned ${response.status}`
    );
  }

  return await response.json();
};

/* -----------------------------------------
   Clean Location Result
----------------------------------------- */

const cleanLocation = (item) => {
  const address = item.address || {};

  const city =
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.county ||
    null;

  return {
    id: item.place_id,

    name:
      city ||
      item.name ||
      item.display_name?.split(",")[0] ||
      "Unknown",

    state:
      address.state ||
      null,

    country:
      address.country ||
      "India",

    latitude:
      Number(item.lat),

    longitude:
      Number(item.lon),

    displayName:
      item.display_name,

    type:
      item.type ||
      item.addresstype ||
      null,
  };
};

/* -----------------------------------------
   Search Locations Controller
----------------------------------------- */

export const searchLocations = async (
  req,
  res
) => {
  try {
    const query = String(
      req.query.query || ""
    ).trim();

    /* Empty query */

    if (!query) {
      return res.status(400).json({
        success: false,
        message:
          "Search query is required",
        results: [],
      });
    }

    /* Minimum characters */

    if (query.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Search at least 2 characters",
        results: [],
      });
    }

    /* Fetch live location data */

    const data = await fetchNominatim(
      query,
      8
    );

    /* Clean results */

    const results = data
      .filter(
        (item) =>
          item.lat &&
          item.lon
      )
      .map(cleanLocation);

    return res.json({
      success: true,

      query,

      count: results.length,

      results,

      source:
        "OpenStreetMap Nominatim",
    });
  } catch (error) {
    console.error(
      "Location Search Error:",
      error.message
    );

    return res.status(502).json({
      success: false,

      message:
        "Unable to search Indian destinations right now",

      results: [],
    });
  }
};