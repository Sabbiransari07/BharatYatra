const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

const getWeatherData = async (latitude, longitude) => {
  const url = new URL(OPEN_METEO_URL);

  url.searchParams.set("latitude", latitude);
  url.searchParams.set("longitude", longitude);

  // Current weather
  url.searchParams.set(
    "current",
    [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "is_day",
    ].join(",")
  );

  // 7-day forecast
  url.searchParams.set(
    "daily",
    [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum",
      "precipitation_probability_max",
      "sunrise",
      "sunset",
    ].join(",")
  );

  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "7");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Open-Meteo API error: ${response.status}`);
  }

  return await response.json();
};

export default getWeatherData;