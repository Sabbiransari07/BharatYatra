// src/utils/helpers.js


// ======================================================
// Debounce
// ======================================================

export function debounce(
  functionToCall,
  delay = 300
) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      functionToCall.apply(this, args);
    }, delay);
  };
}


// ======================================================
// Throttle
// ======================================================

export function throttle(
  functionToCall,
  limit = 300
) {
  let waiting = false;

  return function (...args) {
    if (waiting) {
      return;
    }

    functionToCall.apply(this, args);

    waiting = true;

    setTimeout(() => {
      waiting = false;
    }, limit);
  };
}


// ======================================================
// Safe JSON Parse
// ======================================================

export function safeJsonParse(
  value,
  fallback = null
) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}


// ======================================================
// Safe JSON Stringify
// ======================================================

export function safeJsonStringify(
  value,
  fallback = ""
) {
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
}


// ======================================================
// Generate ID
// ======================================================

export function generateId(
  prefix = "id"
) {
  const randomPart =
    Math.random()
      .toString(36)
      .substring(2, 10);

  const timestamp =
    Date.now().toString(36);

  return `${prefix}-${timestamp}-${randomPart}`;
}


// ======================================================
// Check Empty Value
// ======================================================

export function isEmpty(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim().length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (
    typeof value === "object"
  ) {
    return (
      Object.keys(value).length === 0
    );
  }

  return false;
}


// ======================================================
// Array Helpers
// ======================================================

export function ensureArray(value) {
  return Array.isArray(value)
    ? value
    : [];
}


export function uniqueArray(
  array
) {
  if (!Array.isArray(array)) {
    return [];
  }

  return [...new Set(array)];
}


export function uniqueBy(
  array,
  key
) {
  if (!Array.isArray(array)) {
    return [];
  }

  const seen = new Set();

  return array.filter((item) => {
    const value =
      typeof key === "function"
        ? key(item)
        : item?.[key];

    if (seen.has(value)) {
      return false;
    }

    seen.add(value);

    return true;
  });
}


// ======================================================
// Object Helpers
// ======================================================

export function omit(
  object,
  keys = []
) {
  if (
    !object ||
    typeof object !== "object"
  ) {
    return {};
  }

  const keySet = new Set(keys);

  return Object.fromEntries(
    Object.entries(object).filter(
      ([key]) => !keySet.has(key)
    )
  );
}


export function pick(
  object,
  keys = []
) {
  if (
    !object ||
    typeof object !== "object"
  ) {
    return {};
  }

  return Object.fromEntries(
    keys
      .filter((key) =>
        Object.prototype.hasOwnProperty.call(
          object,
          key
        )
      )
      .map((key) => [
        key,
        object[key],
      ])
  );
}


// ======================================================
// Clamp Number
// ======================================================

export function clamp(
  value,
  minimum,
  maximum
) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return minimum;
  }

  return Math.min(
    maximum,
    Math.max(minimum, number)
  );
}


// ======================================================
// Sleep
// ======================================================

export function sleep(
  milliseconds
) {
  const delay =
    Math.max(
      0,
      Number(milliseconds) || 0
    );

  return new Promise(
    (resolve) =>
      setTimeout(resolve, delay)
  );
}


// ======================================================
// Promise Timeout
// ======================================================

export function withTimeout(
  promise,
  milliseconds = 10000
) {
  const timeout =
    Math.max(
      0,
      Number(milliseconds) || 0
    );

  return Promise.race([
    promise,

    new Promise(
      (_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              "Request timed out."
            )
          );
        }, timeout);
      }
    ),
  ]);
}


// ======================================================
// Function Check
// ======================================================

export function isFunction(
  value
) {
  return (
    typeof value === "function"
  );
}


// ======================================================
// Object Check
// ======================================================

export function isObject(
  value
) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}


// ======================================================
// String Helpers
// ======================================================

export function cleanString(
  value
) {
  return String(
    value ?? ""
  ).trim();
}


export function normalizeSearchText(
  value
) {
  return cleanString(
    value
  )
    .toLowerCase()
    .replace(/\s+/g, " ");
}


// ======================================================
// Sort Helpers
// ======================================================

export function sortBy(
  array,
  key,
  direction = "asc"
) {
  if (!Array.isArray(array)) {
    return [];
  }

  const sorted = [...array];

  sorted.sort((a, b) => {
    const valueA =
      typeof key === "function"
        ? key(a)
        : a?.[key];

    const valueB =
      typeof key === "function"
        ? key(b)
        : b?.[key];

    if (valueA === valueB) {
      return 0;
    }

    if (
      valueA === null ||
      valueA === undefined
    ) {
      return 1;
    }

    if (
      valueB === null ||
      valueB === undefined
    ) {
      return -1;
    }

    const comparison =
      valueA > valueB ? 1 : -1;

    return direction === "desc"
      ? -comparison
      : comparison;
  });

  return sorted;
}


// ======================================================
// Group Array
// ======================================================

export function groupBy(
  array,
  key
) {
  if (!Array.isArray(array)) {
    return {};
  }

  return array.reduce(
    (groups, item) => {
      const groupKey =
        typeof key === "function"
          ? key(item)
          : item?.[key];

      const normalizedKey =
        String(
          groupKey ?? "undefined"
        );

      if (!groups[normalizedKey]) {
        groups[normalizedKey] = [];
      }

      groups[normalizedKey].push(
        item
      );

      return groups;
    },
    {}
  );
}


// ======================================================
// Random Item
// ======================================================

export function randomItem(
  array
) {
  if (
    !Array.isArray(array) ||
    array.length === 0
  ) {
    return null;
  }

  const index = Math.floor(
    Math.random() * array.length
  );

  return array[index];
}


// ======================================================
// Scroll To Element
// ======================================================

export function scrollToElement(
  elementId,
  behavior = "smooth"
) {
  const element =
    document.getElementById(
      elementId
    );

  if (!element) {
    return false;
  }

  element.scrollIntoView({
    behavior,
    block: "start",
  });

  return true;
}


// ======================================================
// Copy To Clipboard
// ======================================================

export async function copyToClipboard(
  text
) {
  try {
    if (
      !navigator.clipboard
    ) {
      return false;
    }

    await navigator.clipboard.writeText(
      String(text ?? "")
    );

    return true;
  } catch {
    return false;
  }
}


// ======================================================
// Error Message
// ======================================================

export function getErrorMessage(
  error,
  fallback =
    "Something went wrong. Please try again."
) {
  if (!error) {
    return fallback;
  }

  if (
    typeof error === "string"
  ) {
    return error;
  }

  return (
    error.message ||
    error?.data?.message ||
    fallback
  );
}