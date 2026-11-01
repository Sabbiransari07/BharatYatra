// src/utils/validators.js


// ======================================================
// Email
// ======================================================

export function isValidEmail(email) {
  const value = String(
    email || ""
  ).trim();

  if (!value) {
    return false;
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(value);
}


// ======================================================
// Mobile
// ======================================================

export function isValidMobile(mobile) {
  const value = String(
    mobile || ""
  ).replace(/\s+/g, "");

  if (!value) {
    return true;
  }

  const mobileRegex =
    /^(?:\+91[-]?)?[6-9]\d{9}$/;

  return mobileRegex.test(value);
}


// ======================================================
// Password
// ======================================================

export function isValidPassword(
  password
) {
  const value = String(
    password || ""
  );

  return value.length >= 6;
}


export function validatePasswordStrength(
  password
) {
  const value = String(
    password || ""
  );

  const result = {
    length: value.length >= 6,
    lowercase: /[a-z]/.test(value),
    uppercase: /[A-Z]/.test(value),
    number: /\d/.test(value),
    special: /[^A-Za-z0-9]/.test(value),
  };

  const score = Object.values(
    result
  ).filter(Boolean).length;

  let strength = "Weak";

  if (score >= 4) {
    strength = "Strong";
  } else if (score >= 2) {
    strength = "Medium";
  }

  return {
    ...result,
    score,
    strength,
  };
}


// ======================================================
// Name
// ======================================================

export function isValidName(name) {
  const value = String(
    name || ""
  ).trim();

  return (
    value.length >= 2 &&
    value.length <= 100
  );
}


// ======================================================
// Required Field
// ======================================================

export function isRequired(value) {
  return (
    value !== null &&
    value !== undefined &&
    String(value).trim().length > 0
  );
}


// ======================================================
// Login Validation
// ======================================================

export function validateLogin({
  email,
  password,
}) {
  const errors = {};

  if (!isValidEmail(email)) {
    errors.email =
      "Please enter a valid email address.";
  }

  if (!isRequired(password)) {
    errors.password =
      "Password is required.";
  }

  return {
    valid:
      Object.keys(errors).length === 0,
    errors,
  };
}


// ======================================================
// Register Validation
// ======================================================

export function validateRegister({
  fullName,
  email,
  mobile = "",
  password,
  confirmPassword,
  acceptTerms = false,
}) {
  const errors = {};

  if (!isValidName(fullName)) {
    errors.fullName =
      "Please enter a valid full name.";
  }

  if (!isValidEmail(email)) {
    errors.email =
      "Please enter a valid email address.";
  }

  if (
    mobile &&
    !isValidMobile(mobile)
  ) {
    errors.mobile =
      "Please enter a valid Indian mobile number.";
  }

  if (!isValidPassword(password)) {
    errors.password =
      "Password must be at least 6 characters.";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword =
      "Passwords do not match.";
  }

  if (!acceptTerms) {
    errors.acceptTerms =
      "Please accept the terms and conditions.";
  }

  return {
    valid:
      Object.keys(errors).length === 0,
    errors,
  };
}


// ======================================================
// Password Confirmation
// ======================================================

export function passwordsMatch(
  password,
  confirmPassword
) {
  return (
    String(password || "") ===
    String(confirmPassword || "")
  );
}


// ======================================================
// Rating Validation
// ======================================================

export function isValidRating(
  rating
) {
  const value = Number(rating);

  return (
    Number.isFinite(value) &&
    value >= 1 &&
    value <= 5
  );
}


// ======================================================
// Review Validation
// ======================================================

export function validateReviewForm({
  rating,
  comment = "",
}) {
  const errors = {};

  if (!isValidRating(rating)) {
    errors.rating =
      "Please select a rating between 1 and 5.";
  }

  const cleanComment =
    String(comment).trim();

  if (!cleanComment) {
    errors.comment =
      "Please write your review.";
  } else if (
    cleanComment.length > 1000
  ) {
    errors.comment =
      "Review cannot exceed 1000 characters.";
  }

  return {
    valid:
      Object.keys(errors).length === 0,
    errors,
  };
}


// ======================================================
// Website Feedback Validation
// ======================================================

export function validateFeedbackForm({
  rating,
  message = "",
}) {
  const errors = {};

  if (!isValidRating(rating)) {
    errors.rating =
      "Please select a rating between 1 and 5.";
  }

  const cleanMessage =
    String(message).trim();

  if (!cleanMessage) {
    errors.message =
      "Please enter your feedback.";
  } else if (
    cleanMessage.length > 2000
  ) {
    errors.message =
      "Feedback cannot exceed 2000 characters.";
  }

  return {
    valid:
      Object.keys(errors).length === 0,
    errors,
  };
}


// ======================================================
// Trip Validation
// ======================================================

export function validateTrip({
  destination,
  days,
  startDate,
}) {
  const errors = {};

  if (!isRequired(destination)) {
    errors.destination =
      "Trip destination is required.";
  }

  const totalDays = Number(days);

  if (
    !Number.isFinite(totalDays) ||
    totalDays < 1
  ) {
    errors.days =
      "Trip must be at least 1 day.";
  }

  if (startDate) {
    const date =
      new Date(startDate);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      errors.startDate =
        "Please enter a valid start date.";
    }
  }

  return {
    valid:
      Object.keys(errors).length === 0,
    errors,
  };
}


// ======================================================
// URL Validation
// ======================================================

export function isValidUrl(url) {
  try {
    const value = String(
      url || ""
    ).trim();

    if (!value) {
      return false;
    }

    new URL(value);

    return true;
  } catch {
    return false;
  }
}


// ======================================================
// Coordinates Validation
// ======================================================

export function areValidCoordinates(
  latitude,
  longitude
) {
  const lat = Number(latitude);
  const lon = Number(longitude);

  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
}