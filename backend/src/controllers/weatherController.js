import getWeatherData from "../services/external/weatherService.js";

const weatherCodeToText = (code) => {
  const weatherCodes = {
    0: "Clear sky",

    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",

    45: "Fog",
    48: "Depositing rime fog",

    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",

    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",

    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",

    66: "Light freezing rain",
    67: "Heavy freezing rain",

    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",

    77: "Snow grains",

    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",

    85: "Slight snow showers",
    86: "Heavy snow showers",

    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };

  return weatherCodes[code] || "Unknown weather";
};

export const getWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const latitude = Number(lat);
    const longitude = Number(lon);

    if (
      Number.isNaN(latitude) ||
      Number.isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude",
      });
    }

    const weather = await getWeatherData(latitude, longitude);

    const current = weather.current;
    const daily = weather.daily;

    const formattedDailyForecast = daily.time.map((date, index) => ({
      date,

      weatherCode: daily.weather_code[index],

      condition: weatherCodeToText(
        daily.weather_code[index]
      ),

      maxTemperature:
        daily.temperature_2m_max[index],

      minTemperature:
        daily.temperature_2m_min[index],

      precipitation:
        daily.precipitation_sum[index],

      precipitationProbability:
        daily.precipitation_probability_max[index],

      sunrise:
        daily.sunrise[index],

      sunset:
        daily.sunset[index],
    }));

    return res.json({
      success: true,

      location: {
        latitude,
        longitude,
        timezone: weather.timezone,
      },

      current: {
        temperature: current.temperature_2m,

        feelsLike:
          current.apparent_temperature,

        humidity:
          current.relative_humidity_2m,

        precipitation:
          current.precipitation,

        windSpeed:
          current.wind_speed_10m,

        weatherCode:
          current.weather_code,

        condition:
          weatherCodeToText(
            current.weather_code
          ),

        isDay:
          Boolean(current.is_day),
      },

      forecast: formattedDailyForecast,

      source: "Open-Meteo",
    });
  } catch (error) {
    console.error(
      "Weather Controller Error:",
      error.message
    );

    return res.status(502).json({
      success: false,
      message:
        "Unable to fetch weather data right now",
    });
  }
};