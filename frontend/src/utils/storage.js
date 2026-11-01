// src/utils/storage.js

// ======================================================
// Local Storage
// ======================================================

export function setLocalItem(key, value) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

    return true;
  } catch (error) {
    console.error(
      "LocalStorage set error:",
      error
    );

    return false;
  }
}

export function getLocalItem(
  key,
  defaultValue = null
) {
  try {
    const value =
      localStorage.getItem(key);

    if (value === null) {
      return defaultValue;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error(
      "LocalStorage get error:",
      error
    );

    return defaultValue;
  }
}

export function removeLocalItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(
      "LocalStorage remove error:",
      error
    );

    return false;
  }
}

export function clearLocalStorage() {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error(
      "LocalStorage clear error:",
      error
    );

    return false;
  }
}


// ======================================================
// Session Storage
// ======================================================

export function setSessionItem(
  key,
  value
) {
  try {
    sessionStorage.setItem(
      key,
      JSON.stringify(value)
    );

    return true;
  } catch (error) {
    console.error(
      "SessionStorage set error:",
      error
    );

    return false;
  }
}

export function getSessionItem(
  key,
  defaultValue = null
) {
  try {
    const value =
      sessionStorage.getItem(key);

    if (value === null) {
      return defaultValue;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error(
      "SessionStorage get error:",
      error
    );

    return defaultValue;
  }
}

export function removeSessionItem(key) {
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(
      "SessionStorage remove error:",
      error
    );

    return false;
  }
}

export function clearSessionStorage() {
  try {
    sessionStorage.clear();
    return true;
  } catch (error) {
    console.error(
      "SessionStorage clear error:",
      error
    );

    return false;
  }
}


// ======================================================
// Token Helpers
// ======================================================

export function saveToken(token) {
  if (!token) {
    return false;
  }

  return setLocalItem(
    "token",
    token
  );
}

export function getToken() {
  return getLocalItem(
    "token",
    null
  );
}

export function removeToken() {
  return removeLocalItem(
    "token"
  );
}

export function hasToken() {
  return Boolean(getToken());
}


// ======================================================
// User Helpers
// ======================================================

export function saveUser(user) {
  if (!user) {
    return false;
  }

  return setLocalItem(
    "bharatYatraUser",
    user
  );
}

export function getUser() {
  return getLocalItem(
    "bharatYatraUser",
    null
  );
}

export function removeUser() {
  return removeLocalItem(
    "bharatYatraUser"
  );
}


// ======================================================
// Authentication Storage
// ======================================================

export function clearAuthStorage() {
  removeToken();
  removeUser();
}


// ======================================================
// Search Result
// ======================================================

export function saveSearchResult(
  result
) {
  return setSessionItem(
    "bharatYatraSearchResult",
    result
  );
}

export function getSearchResult() {
  return getSessionItem(
    "bharatYatraSearchResult",
    null
  );
}

export function clearSearchResult() {
  return removeSessionItem(
    "bharatYatraSearchResult"
  );
}


// ======================================================
// Destination
// ======================================================

export function saveDestination(
  destination
) {
  return setSessionItem(
    "bharatYatraDestination",
    destination
  );
}

export function getSavedDestination() {
  return getSessionItem(
    "bharatYatraDestination",
    null
  );
}

export function clearSavedDestination() {
  return removeSessionItem(
    "bharatYatraDestination"
  );
}