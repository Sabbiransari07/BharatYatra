// src/context/AppContext.jsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AppContext = createContext(null);

const SEARCH_RESULT_KEY =
  "bharatYatraSearchResult";

const DESTINATION_KEY =
  "bharatYatraDestination";

export function AppProvider({ children }) {
  const [searchResult, setSearchResult] =
    useState(() => {
      try {
        const saved =
          sessionStorage.getItem(
            SEARCH_RESULT_KEY
          );

        return saved
          ? JSON.parse(saved)
          : null;
      } catch {
        return null;
      }
    });

  const [destination, setDestination] =
    useState(() => {
      try {
        const saved =
          sessionStorage.getItem(
            DESTINATION_KEY
          );

        return saved
          ? JSON.parse(saved)
          : null;
      } catch {
        return null;
      }
    });

  const [selectedPlace, setSelectedPlace] =
    useState(null);

  const [currentLocation, setCurrentLocation] =
    useState(null);

  const [activeSection, setActiveSection] =
    useState("overview");

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const [trip, setTrip] = useState(null);

  /**
   * Persist search result.
   */
  useEffect(() => {
    if (searchResult) {
      sessionStorage.setItem(
        SEARCH_RESULT_KEY,
        JSON.stringify(searchResult)
      );
    } else {
      sessionStorage.removeItem(
        SEARCH_RESULT_KEY
      );
    }
  }, [searchResult]);

  /**
   * Persist destination.
   */
  useEffect(() => {
    if (destination) {
      sessionStorage.setItem(
        DESTINATION_KEY,
        JSON.stringify(destination)
      );
    } else {
      sessionStorage.removeItem(
        DESTINATION_KEY
      );
    }
  }, [destination]);

  /**
   * Save search result and destination together.
   */
  function selectDestination(result) {
    if (!result) return;

    setSearchResult(result);

    setDestination({
      name: result.name || null,
      state: result.state || null,
      country: result.country || "India",
      latitude: Number(result.latitude),
      longitude: Number(result.longitude),
      displayName:
        result.displayName || null,
      type: result.type || null,
    });
  }

  /**
   * Update destination without replacing
   * the existing search result.
   */
  function updateDestination(data) {
    if (!data) return;

    setDestination((previous) => ({
      ...(previous || {}),
      ...data,
    }));
  }

  /**
   * Clear current destination.
   */
  function clearDestination() {
    setDestination(null);
    setSearchResult(null);
    setSelectedPlace(null);
    setTrip(null);
    setActiveSection("overview");
  }

  /**
   * Select a tourist place / hotel /
   * restaurant / experience.
   */
  function selectPlace(place) {
    setSelectedPlace(place || null);
  }

  /**
   * Clear selected place.
   */
  function clearSelectedPlace() {
    setSelectedPlace(null);
  }

  /**
   * Save user's current geographical location.
   */
  function setLocation(location) {
    if (!location) {
      setCurrentLocation(null);
      return;
    }

    const latitude = Number(
      location.latitude ?? location.lat
    );

    const longitude = Number(
      location.longitude ?? location.lon
    );

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return;
    }

    setCurrentLocation({
      latitude,
      longitude,
      accuracy:
        location.accuracy ?? null,
    });
  }

  /**
   * Clear current location.
   */
  function clearLocation() {
    setCurrentLocation(null);
  }

  /**
   * Set active destination page section.
   */
  function changeSection(section) {
    setActiveSection(
      String(section || "overview")
    );
  }

  /**
   * Toggle mobile/sidebar navigation.
   */
  function toggleSidebar() {
    setIsSidebarOpen(
      (previous) => !previous
    );
  }

  function openSidebar() {
    setIsSidebarOpen(true);
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  /**
   * Store currently active trip.
   */
  function setActiveTrip(tripData) {
    setTrip(tripData || null);
  }

  /**
   * Clear active trip.
   */
  function clearActiveTrip() {
    setTrip(null);
  }

  /**
   * Reset temporary application state.
   */
  function resetAppState() {
    setSearchResult(null);
    setDestination(null);
    setSelectedPlace(null);
    setCurrentLocation(null);
    setActiveSection("overview");
    setTrip(null);
    setIsSidebarOpen(false);
  }

  const value = {
    // Search
    searchResult,
    setSearchResult,

    // Destination
    destination,
    setDestination,
    selectDestination,
    updateDestination,
    clearDestination,

    // Place
    selectedPlace,
    setSelectedPlace,
    selectPlace,
    clearSelectedPlace,

    // Location
    currentLocation,
    setCurrentLocation,
    setLocation,
    clearLocation,

    // Destination sections
    activeSection,
    setActiveSection,
    changeSection,

    // Sidebar
    isSidebarOpen,
    setIsSidebarOpen,
    toggleSidebar,
    openSidebar,
    closeSidebar,

    // Trip
    trip,
    setTrip,
    setActiveTrip,
    clearActiveTrip,

    // Reset
    resetAppState,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * Custom hook.
 */
export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp must be used inside AppProvider."
    );
  }

  return context;
}

export default AppContext;