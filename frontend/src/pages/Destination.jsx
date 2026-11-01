import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../styles/destination.css";

import DestinationCard from "../components/destination/DestinationCard";
import PlaceCard from "../components/destination/PlaceCard";
import SearchBar from "../components/search/SearchBar";
import MapView from "../components/map/MapView";
import WeatherCard from "../components/weather/WeatherCard";
import BudgetPlanner from "../components/budget/BudgetPlanner";
import Chatbot from "../components/chatbot/Chatbot";
import TripPlanner from "../components/trip/TripPlanner";
import SectionHeading from "../components/common/SectionHeading";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";

import useDestination from "../hooks/useDestination";
import useGeolocation from "../hooks/useGeolocation";
import { useApp } from "../context/AppContext";
import { calculateBudget } from "../services/budgetService";
import { createTrip as createTripApi } from "../services/tripService";

import ReviewsSection from "../components/rating/ReviewsSection";
import WebsiteFeedback from "../components/rating/WebsiteFeedback";

import LiveRouteMap from "../components/map/LiveRouteMap";

const API = "http://localhost:5000";

const suggestions = [
  "Uttar Pradesh",
  "Rajasthan",
  "Kerala",
  "Goa",
  "Himachal Pradesh",
  "Kashmir",
];

function Destination() {
  const { query } = useParams();
  const navigate = useNavigate();

  const decodedQuery = useMemo(() => {
    try {
      return decodeURIComponent(query || "").trim();
    } catch {
      return String(query || "").trim();
    }
  }, [query]);

  const [searchText, setSearchText] =
    useState(decodedQuery);

  const {
    setSearchResult,
    setDestination: setAppDestination,
  } = useApp();

  const [selectedDestination, setSelectedDestination] =
    useState(null);

  const [destinationCoordinates, setDestinationCoordinates] =
    useState(null);

  // Place selected by the user for in-page navigation.
  const [selectedRoutePlace, setSelectedRoutePlace] =
    useState(null);

  const [searchLoading, setSearchLoading] =
    useState(true);

  const [searchError, setSearchError] =
    useState("");

  const {
    cities,
    attractions,
    food,
    stays,
    loading: destinationLoading,
    error: destinationError,
    liveDataAvailable,
    message,
    reload: reloadDestination,
  } = useDestination(
    decodedQuery,
    destinationCoordinates?.latitude,
    destinationCoordinates?.longitude,
    Boolean(destinationCoordinates)
  );

  const {
    location,
    latitude: currentLatitude,
    longitude: currentLongitude,
    getCurrentLocation,
    clearLocation,
    loading: locationLoading,
    error: locationError,
    permission: locationPermission,
    hasLocation,
  } = useGeolocation(false);

  const destination =
    selectedDestination ||
    destinationCoordinates ||
    null;

  const loading =
    searchLoading || destinationLoading;

  const error =
    searchError || destinationError || "";

  const counts = {
    attractions: attractions.length,
    food: food.length,
    stays: stays.length,
  };

  const locationStatus = locationLoading
    ? "requesting"
    : hasLocation
      ? "live"
      : locationPermission === "denied"
        ? "denied"
        : locationError
          ? "error"
          : "idle";

  // ---------------------------------------------------------
  // KEEP SEARCH BOX IN SYNC WITH URL
  // ---------------------------------------------------------

  useEffect(() => {
    setSearchText(decodedQuery);
  }, [decodedQuery]);

  // ---------------------------------------------------------
  // LOAD DESTINATION WHEN URL CHANGES
  // ---------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    async function resolveDestination() {
      if (!decodedQuery) {
        setSearchError("No destination was selected.");
        setSearchLoading(false);
        return;
      }

      setSearchLoading(true);
      setSearchError("");

      try {
        const response = await fetch(
          `${API}/api/search?query=${encodeURIComponent(
            decodedQuery
          )}`
        );

        const searchData = await response.json();

        if (!response.ok || !searchData?.success) {
          throw new Error(
            searchData?.message ||
              `Search API error: ${response.status}`
          );
        }

        const selected =
          searchData.results?.find(
            (item) =>
              Number.isFinite(Number(item.latitude)) &&
              Number.isFinite(Number(item.longitude))
          ) || searchData.results?.[0];

        if (!selected) {
          throw new Error(
            "No Indian destination found."
          );
        }

        const latitude = Number(selected.latitude);
        const longitude = Number(selected.longitude);

        if (
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude)
        ) {
          throw new Error(
            "Destination coordinates are invalid."
          );
        }

        if (cancelled) return;

        const normalized = {
          ...selected,
          latitude,
          longitude,
        };

        setSelectedDestination(normalized);

        setDestinationCoordinates({
          name: normalized.name,
          state: normalized.state,
          country: normalized.country || "India",
          latitude,
          longitude,
          displayName: normalized.displayName,
          type: normalized.type,
        });

        setSearchResult(normalized);
        setAppDestination({
          name: normalized.name || null,
          state: normalized.state || null,
          country: normalized.country || "India",
          latitude,
          longitude,
          displayName: normalized.displayName || null,
          type: normalized.type || null,
        });

        sessionStorage.setItem(
          "bharatYatraSearchResult",
          JSON.stringify(normalized)
        );
      } catch (err) {
        if (cancelled) return;

        setSearchError(
          err.message ||
            "Unable to load destination information."
        );
      } finally {
        if (!cancelled) {
          setSearchLoading(false);
        }
      }
    }

    resolveDestination();

    return () => {
      cancelled = true;
    };
  }, [decodedQuery, setSearchResult, setAppDestination]);

  // ---------------------------------------------------------
  // SEARCH
  // ---------------------------------------------------------

  function handleSearch(value) {
    const cleanQuery = String(value || "").trim();

    if (!cleanQuery) {
      return;
    }

    // If user searches same destination, reload it.
    // This is useful if live data needs refreshing.
    if (
      cleanQuery.toLowerCase() ===
      decodedQuery.toLowerCase()
    ) {
      setLoading(true);
      setError("");

      // Replace URL with same query to keep navigation clean.
      navigate(
        `/destination/${encodeURIComponent(cleanQuery)}`,
        { replace: true }
      );

      return;
    }

    console.log(
      "Destination navigation:",
      cleanQuery
    );

    navigate(
      `/destination/${encodeURIComponent(cleanQuery)}`
    );
  }

  // ---------------------------------------------------------
  // POPULAR SEARCH
  // ---------------------------------------------------------

  function handleSuggestionSelect(value) {
    const cleanValue = String(value || "").trim();

    if (!cleanValue) return;

    setSearchText(cleanValue);
    handleSearch(cleanValue);
  }

  // ---------------------------------------------------------
  // BACK
  // ---------------------------------------------------------

  function handleBack() {
    navigate("/dashboard");
  }

  // ---------------------------------------------------------
  // CITY CLICK
  // ---------------------------------------------------------

  function handleCityClick(city) {
    if (!city?.name) return;

    const cityName = String(city.name).trim();

    if (!cityName) return;

    navigate(
      `/destination/${encodeURIComponent(cityName)}`
    );
  }

  // ---------------------------------------------------------
  // OPEN PLACE ON MAP
  // ---------------------------------------------------------

  function openPlaceOnMap(place) {
    const latitude = Number(place?.latitude);
    const longitude = Number(place?.longitude);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      alert("This place does not have valid map coordinates.");
      return;
    }

    setSelectedRoutePlace({
      ...place,
      latitude,
      longitude,
    });

    // Scroll to the navigation map after selecting a place.
    setTimeout(() => {
      document
        .getElementById("live-route-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  }

  // ---------------------------------------------------------
  // LIVE LOCATION
  // ---------------------------------------------------------

  function startLiveLocation() {
    getCurrentLocation();
  }

  function stopLiveLocation() {
    clearLocation();
  }

  // ---------------------------------------------------------
  // BUDGET
  // ---------------------------------------------------------

  function saveBudget(budget) {
    const calculated = calculateBudget(
      budget
    );

    console.log(
      "Budget calculated:",
      {
        destination:
          destination?.name,
        ...calculated,
      }
    );

    alert(
      "Budget calculated successfully!"
    );

    return calculated;
  }

  // ---------------------------------------------------------
  // TRIP
  // ---------------------------------------------------------

  async function createTrip(trip) {
    try {
      const result = await createTripApi({
        ...trip,
        destination:
          destination?.name ||
          trip.destination,
      });

      console.log(
        "Trip created:",
        result
      );

      alert(
        `Trip "${trip.title}" created successfully.`
      );

      return result;
    } catch (err) {
      console.error(
        "Trip creation failed:",
        err
      );

      alert(
        err.message ||
          "Unable to create trip."
      );

      return null;
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="destination-state-screen">
        <div className="destination-message-card">
          <Loader
            text={`Exploring ${
              decodedQuery || "India"
            }...`}
          />

          <p className="destination-loading-note">
            Fetching live destination data...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="destination-state-screen">
        <div className="destination-message-card">
          <div className="destination-error-icon">
            !
          </div>

          <h2>
            Unable to load destination
          </h2>

          <p>{error}</p>

          <div className="destination-actions">
            <button
              onClick={() => {
                setSearchError("");
                if (destinationCoordinates) {
                  reloadDestination();
                } else {
                  window.location.reload();
                }
              }}
            >
              Try Again
            </button>

            <button
              className="secondary"
              onClick={handleBack}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN DESTINATION PAGE
  // =========================================================

  return (
    <div className="destination-page">

      {/* =====================================================
          DESTINATION HEADER
          No search here — only back + branding
      ====================================================== */}

      <header className="destination-component-header">

        <button
          type="button"
          onClick={handleBack}
          className="back-button"
          aria-label="Back to dashboard">
          ←
        </button>

        <div className="logo">
            <h1>BharatYatra</h1>
            <span>Explore • Experience • India</span>
          </div>

      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="destination-main">

        {/* =====================================================
            STATE / DESTINATION INTRO
        ====================================================== */}

        <section className="state-hero">

          <div>

            <small>
              ✦ STATE-WISE TOURISM
            </small>

            <h2>
              Explore{" "}
              <strong>
                {destination?.name ||
                  decodedQuery}
              </strong>
            </h2>

            <p>
              Discover destinations, heritage,
              culture, food and experiences across
              this region using live location data.
            </p>

            <div className="state-meta">

              <span>
                📍{" "}
                {destination?.state ||
                  destination?.name ||
                  "India"}
              </span>

              <span>
                🌐{" "}
                {destination?.country ||
                  "India"}
              </span>

            </div>

          </div>

        </section>

        {/* =====================================================
            SINGLE SEARCH BAR
        ====================================================== */}

        <section className="destination-quick-search">

          <SearchBar
            value={searchText}
            onChange={setSearchText}
            onSubmit={handleSearch}
            placeholder="Search another city, state or destination..."
          />

          <div className="destination-search-suggestions">

            <span>
              Popular:
            </span>

            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  handleSuggestionSelect(item)
                }
              >
                {item}
              </button>
            ))}

          </div>

        </section>

        {/* =====================================================
            STATE CITIES
        ====================================================== */}

        <section className="destination-section">

          <SectionHeading
            title="Top destinations to explore"
            description="Choose a city or destination to explore its tourism information."
            action={
              <b>
                ● LIVE DATA
              </b>
            }
          />

          {cities.length > 0 ? (

            <div className="city-grid">

              {cities.map((city) => (
                <DestinationCard
                  key={
                    city.id ||
                    city.name
                  }
                  destination={city}
                  onClick={handleCityClick}
                />
              ))}

            </div>

          ) : (

            <EmptyState
              icon="🧭"
              title="No city results found"
              message="Try another Indian state or destination."
            />

          )}

        </section>

        {/* =====================================================
            TOURIST PLACES
        ====================================================== */}

        <section className="destination-section">

          <SectionHeading
            title="Tourist places"
            description="Live attractions returned for the searched region."
          />

          {attractions.length > 0 ? (

            <div className="place-grid">

              {attractions
                .slice(0, 18)
                .map((place) => (
                  <PlaceCard
                    key={
                      place.id ||
                      place.name
                    }
                    place={place}
                    onMap={openPlaceOnMap}
                  />
                ))}

            </div>

          ) : (

            <EmptyState
              icon="🏛️"
              title="No tourist places found"
              message="No public attraction data was returned for this region."
            />

          )}

        </section>

        {/* =====================================================
        FOOD
        ====================================================== */}

        <section className="destination-section">

        <SectionHeading
        title="Restaurants & Cafés"
        description="Live food places near the searched destination."action={<b>
        {food.length} PLACES
        </b>}/>

  {food.length > 0 ? (

    <div className="place-grid">

      {food.slice(0, 20).map((place) => (
        <PlaceCard
          key={
            place.id ||
            `${place.name}-${place.latitude}-${place.longitude}`
          }
          place={place}
          onMap={openPlaceOnMap}
        />
      ))}

    </div>

  ) : (

    <EmptyState
      icon="🍛"
      title="No food places found"
      message="No live restaurant or café data was returned near this destination. Try searching a nearby city."
    />

  )}

</section>


{/* =====================================================
    STAYS
====================================================== */}

<section className="destination-section">

  <SectionHeading
    title="Hotels & Stays"
    description="Live accommodation options near the searched destination."
    action={
      <b>
        {stays.length} PLACES
      </b>
    }
  />

  {stays.length > 0 ? (

    <div className="place-grid">

      {stays.slice(0, 20).map((place) => (
        <PlaceCard
          key={
            place.id ||
            `${place.name}-${place.latitude}-${place.longitude}`
          }
          place={place}
          onMap={openPlaceOnMap}
        />
      ))}

    </div>

  ) : (

    <EmptyState
      icon="🏨"
      title="No stays found"
      message="No live hotel or accommodation data was returned near this destination. Try searching a nearby city."
    />

  )}

</section>
        {/* =====================================================
            LIVE LOCATION
        ====================================================== */}

        <section className="location-section">

          <SectionHeading
            title="Use your live location"
            description="This will power nearby places, distance and route features."
            action={
              locationStatus === "live" ? (
                <b>
                  ● LOCATION LIVE
                </b>
              ) : null
            }
          />

          <div className="location-card">

            <div>

              <span className="location-icon">
                {locationStatus === "live"
                  ? "📡"
                  : "📍"}
              </span>

              <div>

                <h3>
                  {locationStatus === "live"
                    ? "Live location is active"
                    : "Location is not active"}
                </h3>

                <p>
                  {locationStatus === "live"
                    ? `Accuracy approximately ${location.accuracy} metres.`
                    : "Enable location when you need location-based features."}
                </p>

              </div>

            </div>

            {locationStatus === "live" ? (

              <button
                className="stop"
                onClick={stopLiveLocation}
              >
                Stop Location
              </button>

            ) : (

              <button
                onClick={startLiveLocation}
                disabled={
                  locationStatus ===
                  "requesting"
                }
              >
                {locationStatus ===
                "requesting"
                  ? "Requesting..."
                  : "Use My Location"}
              </button>

            )}

          </div>

          {locationStatus === "live" && (

            <div className="coordinates">

              <div>
                Latitude

                <strong>
                  {location.latitude.toFixed(5)}
                </strong>
              </div>

              <div>
                Longitude

                <strong>
                  {location.longitude.toFixed(5)}
                </strong>
              </div>

              <div>
                Accuracy

                <strong>
                  {location.accuracy} m
                </strong>
              </div>

            </div>

          )}

          {locationStatus === "denied" && (

            <div className="location-error">
              Location permission was denied.
              Enable it from browser settings.
            </div>

          )}

          {locationStatus === "unsupported" && (

            <div className="location-error">
              Your browser does not support live location.
            </div>

          )}

          {locationStatus === "error" && (

            <div className="location-error">
              Unable to get your current location.
              Please try again.
            </div>

          )}

        </section>

        <section
          id="live-route-section"
          className="destination-section"
        >
          <SectionHeading
            title="Navigation"
            description={
              selectedRoutePlace
                ? `Route from your live location to ${selectedRoutePlace.name}.`
                : "Select View on Map on any place to start navigation."
            }
          />

          {!selectedRoutePlace ? (
            <div className="route-placeholder">
              <div className="route-placeholder-icon">
                🧭
              </div>

              <h3>Select a place to navigate</h3>

              <p>
                Choose <strong>View on Map</strong> on a
                tourist place, restaurant or hotel.
                Your route will appear here.
              </p>

              {locationStatus !== "live" && (
                <button
                  type="button"
                  onClick={startLiveLocation}
                  disabled={locationStatus === "requesting"}
                >
                  {locationStatus === "requesting"
                    ? "Requesting Location..."
                    : "📍 Enable My Location"}
                </button>
              )}
            </div>
          ) : (
            <div className="selected-route-container">
              <div className="selected-route-heading">
                <div>
                  <span className="selected-route-label">
                    DESTINATION SELECTED
                  </span>
                  <h3>
                    📌 {selectedRoutePlace.name}
                  </h3>
                </div>

                <button
                  type="button"
                  className="clear-route-button"
                  onClick={() => setSelectedRoutePlace(null)}
                >
                  Clear Route
                </button>
              </div>

              {!hasLocation ? (
                <div className="route-location-required">
                  <strong>📍 Your live location is required</strong>
                  <p>
                    Enable your location to calculate the
                    road route from you to this place.
                  </p>

                  <button
                    type="button"
                    onClick={startLiveLocation}
                    disabled={locationStatus === "requesting"}
                  >
                    {locationStatus === "requesting"
                      ? "Requesting Location..."
                      : "📍 Use My Location"}
                  </button>
                </div>
              ) : (
                <LiveRouteMap
                  userLocation={{
                    latitude: currentLatitude,
                    longitude: currentLongitude,
                  }}
                  destination={selectedRoutePlace}
                  mode="drive"
                />
              )}
            </div>
          )}
        </section>

        {/* =====================================================
            WEATHER
        ====================================================== */}

        <section className="destination-section">

          <SectionHeading
            title="Destination weather"
            description="Live weather API will use this destination's coordinates."
          />

          <WeatherCard
            latitude={
              destination?.latitude ||
              location?.latitude
            }
            longitude={
              destination?.longitude ||
              location?.longitude
            }
            locationName={
              destination?.name ||
              decodedQuery ||
              "India"
            }
          />

        </section>

        {/* =====================================================
            BUDGET
        ====================================================== */}

        <section className="destination-section">

          <SectionHeading
            title="Plan your trip budget"
            description="Estimate your travel expenses before you go."
          />

          <BudgetPlanner
            onSave={saveBudget}
          />

        </section>

        {/* =====================================================
            TRIP PLANNER
        ====================================================== */}

        <section className="destination-section">

          <SectionHeading
            title="Create your itinerary"
            description="Start saving this destination as a trip."
          />

          <TripPlanner
            destination={
              destination?.name
            }
            onCreate={createTrip}
          />

        </section>

        {/* =====================================================
            FREE AI CHATBOT
        ====================================================== */}

        <section className="destination-section">

          <SectionHeading
            title="Ask BharatYatra AI"
            description="Get travel planning help from the free AI travel assistant."
          />

          <Chatbot
            destination={{
              name:
                destination?.name,

              state:
                destination?.state,

              latitude:
                destination?.latitude,

              longitude:
                destination?.longitude,
            }}
          />

        </section>

        {/* =====================================================
    REVIEWS & FEEDBACK
====================================================== */}

<section className="destination-section">

  <SectionHeading
    title="Reviews & Feedback"
    description="Share your travel experience and help us improve BharatYatra."
  />

  {attractions.length > 0 ? (
    <ReviewsSection
      place={attractions[0]}
    />
  ) : (
    <div className="review-no-place">
      Reviews will appear when live places are available.
    </div>
  )}

  <WebsiteFeedback />

</section>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <footer className="destination-footer">
          TRAVEL • EXPLORE • EXPERIENCE • REPEAT
        </footer>

      </main>

    </div>
  );
}

export default Destination;