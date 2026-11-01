// src/utils/constants.js

// ======================================================
// API
// ======================================================

export const API_BASE_URL =
  "http://localhost:5000";


// ======================================================
// Application
// ======================================================

export const APP_NAME = "BharatYatra";

export const APP_TAGLINE =
  "Explore • Experience • India";

export const APP_SLOGAN =
  "TRAVEL • EXPLORE • EXPERIENCE • REPEAT";


// ======================================================
// Local Storage Keys
// ======================================================

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "bharatYatraUser",
};


// ======================================================
// Session Storage Keys
// ======================================================

export const SESSION_KEYS = {
  SEARCH_RESULT:
    "bharatYatraSearchResult",

  DESTINATION:
    "bharatYatraDestination",

  SELECTED_PLACE:
    "bharatYatraSelectedPlace",

  ACTIVE_TRIP:
    "bharatYatraActiveTrip",
};


// ======================================================
// Application Routes
// ======================================================

export const ROUTES = {
  HOME: "/",

  LOGIN: "/login",

  REGISTER: "/register",

  DASHBOARD: "/dashboard",

  DESTINATION: "/destination",

  PROFILE: "/profile",

  TRIPS: "/trips",

  SAVED: "/saved",

  SETTINGS: "/settings",
};


// ======================================================
// Destination Sections
// ======================================================

export const DESTINATION_SECTIONS = {
  OVERVIEW: "overview",

  PLACES: "places",

  FOOD: "food",

  STAYS: "stays",

  EXPERIENCES: "experiences",

  GUIDES: "guides",

  TRANSPORT: "transport",

  MAP: "map",

  WEATHER: "weather",

  BUDGET: "budget",

  TRIP: "trip",

  CHATBOT: "chatbot",
};


// ======================================================
// Tourism Categories
// ======================================================

export const TOURISM_CATEGORIES = {
  ATTRACTIONS: "attractions",

  FOOD: "food",

  STAYS: "stays",

  EXPERIENCES: "experiences",

  GUIDES: "guides",

  TRANSPORT: "transport",
};


// ======================================================
// Popular Indian Destinations
// ======================================================

export const POPULAR_DESTINATIONS = [
  "Kerala",
  "Rajasthan",
  "Himachal Pradesh",
  "Varanasi",
  "Goa",
  "Kashmir",
];


// ======================================================
// Search
// ======================================================

export const SEARCH_CONFIG = {
  MIN_LENGTH: 2,

  MAX_RESULTS: 8,

  DEBOUNCE_MS: 300,
};


// ======================================================
// Map
// ======================================================

export const MAP_CONFIG = {
  DEFAULT_ZOOM: 11,

  DETAIL_ZOOM: 14,

  NEARBY_RADIUS: 5000,
};


// ======================================================
// Budget
// ======================================================

export const BUDGET_DEFAULTS = {
  DAYS: 3,

  TRAVELLERS: 2,

  STAY_PER_DAY: 2000,

  FOOD_PER_PERSON_PER_DAY: 700,

  TRANSPORT_PER_PERSON_PER_DAY: 800,

  ACTIVITIES_PER_PERSON_PER_DAY: 500,
};


// ======================================================
// Rating
// ======================================================

export const RATING_CONFIG = {
  MIN: 1,

  MAX: 5,
};


// ======================================================
// Validation
// ======================================================

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,

  MAX_NAME_LENGTH: 100,

  MAX_REVIEW_LENGTH: 1000,

  MAX_FEEDBACK_LENGTH: 2000,
};


// ======================================================
// Chatbot
// ======================================================

export const CHATBOT_CONFIG = {
  NAME: "BharatYatra AI",

  STATUS: "Free Travel Assistant",

  MAX_MESSAGE_LENGTH: 2000,
};


// ======================================================
// Weather
// ======================================================

export const WEATHER_CONFIG = {
  FORECAST_DAYS: 7,
};


// ======================================================
// Pagination
// ======================================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,

  DEFAULT_LIMIT: 20,

  MAX_LIMIT: 100,
};


// ======================================================
// Date / Time
// ======================================================

export const DATE_FORMATS = {
  DISPLAY: "DD MMM YYYY",

  API: "YYYY-MM-DD",
};


// ======================================================
// Common Messages
// ======================================================

export const MESSAGES = {
  LOADING:
    "Loading...",

  SOMETHING_WENT_WRONG:
    "Something went wrong. Please try again.",

  NETWORK_ERROR:
    "Unable to connect to BharatYatra server.",

  NO_RESULTS:
    "No results found.",

  LOCATION_REQUIRED:
    "Valid location coordinates are required.",

  LOGIN_REQUIRED:
    "Please login to continue.",
};