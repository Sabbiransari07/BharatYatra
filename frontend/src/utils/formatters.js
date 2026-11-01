// src/utils/formatters.js


// ======================================================
// Currency
// ======================================================

export function formatCurrency(
  amount,
  currency = "INR"
) {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "₹0";
  }

  try {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }
    ).format(value);
  } catch {
    return `₹${Math.round(value).toLocaleString(
      "en-IN"
    )}`;
  }
}


export function formatIndianCurrency(
  amount
) {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "₹0";
  }

  return `₹${Math.round(value).toLocaleString(
    "en-IN"
  )}`;
}


// ======================================================
// Numbers
// ======================================================

export function formatNumber(
  value,
  decimals = 0
) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return number.toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }
  );
}


// ======================================================
// Distance
// ======================================================

export function formatDistance(
  distanceInMeters
) {
  const distance =
    Number(distanceInMeters);

  if (!Number.isFinite(distance)) {
    return "Distance unavailable";
  }

  if (distance < 1000) {
    return `${Math.round(distance)} m`;
  }

  return `${(distance / 1000).toFixed(1)} km`;
}


// ======================================================
// Coordinates
// ======================================================

export function formatCoordinates(
  latitude,
  longitude
) {
  const lat = Number(latitude);
  const lon = Number(longitude);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon)
  ) {
    return "Location unavailable";
  }

  return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
}


// ======================================================
// Date
// ======================================================

export function formatDate(
  date,
  options = {}
) {
  if (!date) {
    return "Date unavailable";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "Invalid date";
  }

  const defaultOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      ...defaultOptions,
      ...options,
    }
  );
}


// ======================================================
// Date + Time
// ======================================================

export function formatDateTime(
  date
) {
  if (!date) {
    return "Date unavailable";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "Invalid date";
  }

  return parsedDate.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}


// ======================================================
// Time
// ======================================================

export function formatTime(
  date
) {
  if (!date) {
    return "Time unavailable";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "Invalid time";
  }

  return parsedDate.toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}


// ======================================================
// Duration
// ======================================================

export function formatDuration(
  minutes
) {
  const value = Number(minutes);

  if (
    !Number.isFinite(value) ||
    value < 0
  ) {
    return "0 min";
  }

  const hours = Math.floor(
    value / 60
  );

  const remainingMinutes =
    Math.round(value % 60);

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}


// ======================================================
// Text
// ======================================================

export function capitalize(
  text
) {
  const value = String(
    text || ""
  ).trim();

  if (!value) {
    return "";
  }

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}


export function capitalizeWords(
  text
) {
  const value = String(
    text || ""
  ).trim();

  if (!value) {
    return "";
  }

  return value
    .split(/\s+/)
    .map((word) => capitalize(word))
    .join(" ");
}


// ======================================================
// Truncate Text
// ======================================================

export function truncateText(
  text,
  maxLength = 100
) {
  const value = String(
    text || ""
  ).trim();

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(
    0,
    Math.max(0, maxLength - 3)
  )}...`;
}


// ======================================================
// Rating
// ======================================================

export function formatRating(
  rating
) {
  const value = Number(rating);

  if (
    !Number.isFinite(value)
  ) {
    return "0.0";
  }

  return Math.min(
    5,
    Math.max(0, value)
  ).toFixed(1);
}


// ======================================================
// Percentage
// ======================================================

export function formatPercentage(
  value,
  decimals = 0
) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0%";
  }

  return `${number.toFixed(
    decimals
  )}%`;
}


// ======================================================
// File Size
// ======================================================

export function formatFileSize(
  bytes
) {
  const value = Number(bytes);

  if (
    !Number.isFinite(value) ||
    value < 0
  ) {
    return "0 Bytes";
  }

  if (value === 0) {
    return "0 Bytes";
  }

  const units = [
    "Bytes",
    "KB",
    "MB",
    "GB",
    "TB",
  ];

  const index = Math.floor(
    Math.log(value) /
      Math.log(1024)
  );

  const safeIndex = Math.min(
    index,
    units.length - 1
  );

  const size =
    value /
    Math.pow(1024, safeIndex);

  return `${size.toFixed(
    safeIndex === 0 ? 0 : 1
  )} ${units[safeIndex]}`;
}


// ======================================================
// Weather Temperature
// ======================================================

export function formatTemperature(
  temperature
) {
  const value = Number(
    temperature
  );

  if (!Number.isFinite(value)) {
    return "N/A";
  }

  return `${Math.round(value)}°C`;
}