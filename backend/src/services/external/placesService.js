const GEOAPIFY_URL = "https://api.geoapify.com/v2/places";

const getPlaces = async ({
  latitude,
  longitude,
  categories,
  limit = 30,
  radius = 10000,
}) => {
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    throw new Error("GEOAPIFY_API_KEY is missing in backend/.env");
  }

  if (
    !Number.isFinite(Number(latitude)) ||
    !Number.isFinite(Number(longitude))
  ) {
    throw new Error("Valid latitude and longitude are required");
  }

  const url = new URL(GEOAPIFY_URL);

  url.searchParams.set("categories", categories);

  url.searchParams.set(
    "filter",
    `circle:${Number(longitude)},${Number(latitude)},${radius}`
  );

  url.searchParams.set(
    "bias",
    `proximity:${Number(longitude)},${Number(latitude)}`
  );

  url.searchParams.set("limit", String(limit));
  url.searchParams.set("lang", "en");
  url.searchParams.set("apiKey", apiKey);

  console.log(`Geoapify request: ${categories}`);

  const response = await fetch(url);
  const text = await response.text();

  if (!response.ok) {
    console.error(
      "Geoapify Error:",
      response.status,
      text
    );

    throw new Error(
      `Geoapify API returned ${response.status}`
    );
  }

  try {
    const data = JSON.parse(text);

    console.log(
      `Geoapify results for ${categories}: ${
        data.features?.length || 0
      }`
    );

    return data;
  } catch {
    throw new Error(
      "Geoapify returned invalid JSON"
    );
  }
};

export default getPlaces;