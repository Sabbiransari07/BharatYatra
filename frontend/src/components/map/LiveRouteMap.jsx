import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";

const API = "http://localhost:5000";

const userIcon = new L.DivIcon({
  className: "live-user-marker",
  html: `<div class="live-user-marker-inner">📍</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const destinationIcon = new L.DivIcon({
  className: "destination-marker",
  html: `<div class="destination-marker-inner">📌</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function FitRoute({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (!positions || positions.length < 2) return;

    map.fitBounds(L.latLngBounds(positions), {
      padding: [50, 50],
    });
  }, [positions, map]);

  return null;
}

function LiveRouteMap({
  userLocation,
  destination,
  mode = "drive",
}) {
  const [selectedMode, setSelectedMode] = useState(mode);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasUserLocation =
    Number.isFinite(Number(userLocation?.latitude)) &&
    Number.isFinite(Number(userLocation?.longitude));

  const hasDestination =
    Number.isFinite(Number(destination?.latitude)) &&
    Number.isFinite(Number(destination?.longitude));

  useEffect(() => {
    if (!hasUserLocation || !hasDestination) {
      setRoute(null);
      return;
    }

    const controller = new AbortController();

    async function fetchRoute() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          fromLat: String(userLocation.latitude),
          fromLon: String(userLocation.longitude),
          toLat: String(destination.latitude),
          toLon: String(destination.longitude),
          mode: selectedMode,
        });

        const response = await fetch(
          `${API}/api/route?${params.toString()}`,
          {
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok || !data?.success) {
          throw new Error(
            data?.message || "Unable to calculate route."
          );
        }

        setRoute(data);
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Route error:", err);
        setError(
          err?.message || "Unable to calculate route."
        );
        setRoute(null);
      } finally {
        setLoading(false);
      }
    }

    fetchRoute();

    return () => controller.abort();
  }, [
    userLocation?.latitude,
    userLocation?.longitude,
    destination?.latitude,
    destination?.longitude,
    selectedMode,
    hasUserLocation,
    hasDestination,
  ]);

  if (!hasUserLocation) {
    return (
      <div className="route-placeholder">
        📍 Enable your live location to calculate the route.
      </div>
    );
  }

  if (!hasDestination) {
    return (
      <div className="route-placeholder">
        📌 Destination coordinates are unavailable.
      </div>
    );
  }

  const userPosition = [
    Number(userLocation.latitude),
    Number(userLocation.longitude),
  ];

  const destinationPosition = [
    Number(destination.latitude),
    Number(destination.longitude),
  ];

  const geometry = route?.route?.geometry;

  let routePositions = [];

  if (geometry?.type === "LineString") {
    routePositions = geometry.coordinates.map(
      ([longitude, latitude]) => [
        latitude,
        longitude,
      ]
    );
  }

  if (geometry?.type === "MultiLineString") {
    routePositions = geometry.coordinates.flatMap(
      (line) =>
        line.map(([longitude, latitude]) => [
          latitude,
          longitude,
        ])
    );
  }

  const fitPositions =
    routePositions.length > 1
      ? routePositions
      : [userPosition, destinationPosition];

  return (
    <div className="live-route-wrapper">

      {/* HEADER */}
      <div className="route-map-header">

        <div>
          <span className="selected-route-label">
            LIVE NAVIGATION
          </span>

          <h3>
            📍 Your Location → 📌{" "}
            {destination?.name || "Destination"}
          </h3>
        </div>

        {loading && (
          <span className="route-loading">
            Calculating...
          </span>
        )}

      </div>

      {/* TRAVEL MODE */}
      <div className="route-mode-selector">

        <span className="route-mode-title">
          Travel mode
        </span>

        <div className="route-mode-buttons">

          <button
            type="button"
            className={
              selectedMode === "drive"
                ? "route-mode active"
                : "route-mode"
            }
            onClick={() =>
              setSelectedMode("drive")
            }
          >
            🚗
            <span>Driving</span>
          </button>

          <button
            type="button"
            className={
              selectedMode === "walk"
                ? "route-mode active"
                : "route-mode"
            }
            onClick={() =>
              setSelectedMode("walk")
            }
          >
            🚶
            <span>Walking</span>
          </button>

          <button
            type="button"
            className={
              selectedMode === "bicycle"
                ? "route-mode active"
                : "route-mode"
            }
            onClick={() =>
              setSelectedMode("bicycle")
            }
          >
            🚴
            <span>Bicycle</span>
          </button>

        </div>

      </div>

      {/* ERROR */}
      {error && (
        <div className="route-error">
          ⚠️ {error}
        </div>
      )}

      {/* MAP */}
      <div className="route-map">

        <MapContainer
          center={userPosition}
          zoom={13}
          scrollWheelZoom
          style={{
            height: "500px",
            width: "100%",
          }}
        >

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={userPosition}
            icon={userIcon}
          >
            <Popup>
              <strong>
                📍 Your Live Location
              </strong>
              <br />
              Starting point
            </Popup>
          </Marker>

          <Marker
            position={destinationPosition}
            icon={destinationIcon}
          >
            <Popup>
              <strong>
                📌 {destination?.name || "Destination"}
              </strong>
              <br />
              Destination
            </Popup>
          </Marker>

          {routePositions.length > 1 && (
            <Polyline
              positions={routePositions}
              weight={6}
              opacity={0.85}
            />
          )}

          <FitRoute
            positions={fitPositions}
          />

        </MapContainer>

      </div>

      {/* ROUTE DETAILS */}
      {route?.success && (
        <div className="route-info">

          <div className="route-info-item">
            <span>📏</span>

            <div>
              <small>Distance</small>

              <strong>
                {route.distance?.kilometers ?? "--"} km
              </strong>
            </div>
          </div>

          <div className="route-info-item">
            <span>⏱️</span>

            <div>
              <small>Estimated time</small>

              <strong>
                {route.duration?.minutes ?? "--"} min
              </strong>
            </div>
          </div>

          <div className="route-info-item">
            <span>
              {selectedMode === "walk"
                ? "🚶"
                : selectedMode === "bicycle"
                ? "🚴"
                : "🚗"}
            </span>

            <div>
              <small>Travel mode</small>

              <strong>
                {selectedMode === "walk"
                  ? "Walking"
                  : selectedMode === "bicycle"
                  ? "Bicycle"
                  : "Driving"}
              </strong>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default LiveRouteMap;