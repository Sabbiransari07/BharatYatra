const GEOAPIFY_ROUTING_URL =
  "https://api.geoapify.com/v1/routing";

const calculateRoute = async ({
  fromLatitude,
  fromLongitude,
  toLatitude,
  toLongitude,
  mode = "drive",
}) => {
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEOAPIFY_API_KEY is missing in backend/.env"
    );
  }

  const validModes = [
    "drive",
    "walk",
    "bicycle",
    "motorcycle",
    "scooter",
    "hike",
  ];

  if (!validModes.includes(mode)) {
    throw new Error(`Unsupported routing mode: ${mode}`);
  }

  const url = new URL(GEOAPIFY_ROUTING_URL);

  url.searchParams.set(
    "waypoints",
    `${fromLatitude},${fromLongitude}|${toLatitude},${toLongitude}`
  );

  url.searchParams.set("mode", mode);
  url.searchParams.set("format", "geojson");
  url.searchParams.set("units", "metric");
  url.searchParams.set("lang", "en");
  url.searchParams.set("traffic", "approximated");
  url.searchParams.set("apiKey", apiKey);

  console.log(
    `Routing request: ${fromLatitude},${fromLongitude} → ${toLatitude},${toLongitude}`
  );

  const response = await fetch(url);

  const text = await response.text();

  if (!response.ok) {
    console.error(
      "Geoapify Routing Error:",
      response.status,
      text
    );

    throw new Error(
      `Geoapify Routing API returned ${response.status}`
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      "Geoapify Routing API returned invalid JSON"
    );
  }
};

export default calculateRoute;