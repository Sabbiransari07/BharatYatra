import { useEffect, useState } from "react";

function WeatherCard({ latitude, longitude, locationName = "Destination" }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!latitude || !longitude) {
      setLoading(false);
      return;
    }

    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/weather?lat=${encodeURIComponent(
            latitude
          )}&lon=${encodeURIComponent(longitude)}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to fetch weather"
          );
        }

        setWeather(data);
      } catch (err) {
        console.error("Weather Error:", err);
        setError("Weather data unavailable");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  if (loading) {
    return (
      <div className="weather-card">
        <div className="weather-loading">
          Loading weather...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-card">
        <div className="weather-error">
          {error}
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="weather-card">
        <div className="weather-error">
          Weather location unavailable
        </div>
      </div>
    );
  }

  const current = weather.current;

  return (
    <div className="weather-card">
      <div className="weather-header">
        <div>
          <span className="weather-label">
            WEATHER
          </span>

          <h3>{locationName}</h3>
        </div>

        <span className="weather-icon">
          {current.weatherCode === 0
            ? "☀️"
            : current.weatherCode <= 3
            ? "⛅"
            : current.weatherCode >= 95
            ? "⛈️"
            : "🌦️"}
        </span>
      </div>

      <div className="weather-current">
        <div className="weather-temperature">
          {Math.round(current.temperature)}°C
        </div>

        <div className="weather-condition">
          {current.condition}
        </div>
      </div>

      <div className="weather-details">
        <div className="weather-detail">
          <span>Feels like</span>
          <strong>
            {Math.round(current.feelsLike)}°C
          </strong>
        </div>

        <div className="weather-detail">
          <span>Humidity</span>
          <strong>
            {current.humidity}%
          </strong>
        </div>

        <div className="weather-detail">
          <span>Wind</span>
          <strong>
            {Math.round(current.windSpeed)} km/h
          </strong>
        </div>

        <div className="weather-detail">
          <span>Rain</span>
          <strong>
            {current.precipitation} mm
          </strong>
        </div>
      </div>

      <div className="weather-forecast">
        <h4>7-Day Forecast</h4>

        <div className="forecast-list">
          {weather.forecast.map((day) => (
            <div
              className="forecast-item"
              key={day.date}
            >
              <span>
                {new Date(day.date).toLocaleDateString(
                  "en-IN",
                  {
                    weekday: "short",
                  }
                )}
              </span>

              <span>
                {day.condition}
              </span>

              <strong>
                {Math.round(day.maxTemperature)}°
                {" / "}
                {Math.round(day.minTemperature)}°
              </strong>
            </div>
          ))}
        </div>
      </div>

      <div className="weather-source">
        Weather data by Open-Meteo
      </div>
    </div>
  );
}

export default WeatherCard;