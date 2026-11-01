// src/services/reviewService.js

import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
} from "./api";

/**
 * Get reviews for a place.
 *
 * Backend:
 * GET /api/reviews/place/:placeId
 */
export async function getPlaceReviews(placeId) {
  if (!placeId) {
    throw new Error("Place ID is required.");
  }

  return apiGet(
    `/api/reviews/place/${encodeURIComponent(placeId)}`
  );
}

/**
 * Get reviews for a trip.
 *
 * Backend:
 * GET /api/reviews/trip/:tripId
 */
export async function getTripReviews(tripId) {
  if (!tripId) {
    throw new Error("Trip ID is required.");
  }

  return apiGet(
    `/api/reviews/trip/${encodeURIComponent(tripId)}`
  );
}

/**
 * Get reviews created by the logged-in user.
 *
 * Backend:
 * GET /api/reviews/my
 */
export async function getMyReviews() {
  return apiGet("/api/reviews/my");
}

/**
 * Create a new review.
 *
 * @param {object} reviewData
 *
 * Example:
 * {
 *   placeId: "...",
 *   placeName: "Taj Mahal",
 *   rating: 5,
 *   comment: "Amazing experience!"
 * }
 */
export async function createReview(reviewData) {
  if (
    !reviewData ||
    typeof reviewData !== "object"
  ) {
    throw new Error("Review data is required.");
  }

  const rating = Number(reviewData.rating);

  if (!Number.isFinite(rating)) {
    throw new Error("Rating is required.");
  }

  if (rating < 1 || rating > 5) {
    throw new Error(
      "Rating must be between 1 and 5."
    );
  }

  return apiPost(
    "/api/reviews",
    {
      ...reviewData,
      rating,
    }
  );
}

/**
 * Update an existing review.
 *
 * Backend:
 * PUT /api/reviews/:reviewId
 */
export async function updateReview(
  reviewId,
  reviewData
) {
  if (!reviewId) {
    throw new Error("Review ID is required.");
  }

  if (
    !reviewData ||
    typeof reviewData !== "object"
  ) {
    throw new Error("Review data is required.");
  }

  if (reviewData.rating !== undefined) {
    const rating = Number(
      reviewData.rating
    );

    if (
      !Number.isFinite(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      throw new Error(
        "Rating must be between 1 and 5."
      );
    }

    reviewData = {
      ...reviewData,
      rating,
    };
  }

  return apiPut(
    `/api/reviews/${encodeURIComponent(
      reviewId
    )}`,
    reviewData
  );
}

/**
 * Delete a review.
 *
 * Backend:
 * DELETE /api/reviews/:reviewId
 */
export async function deleteReview(
  reviewId
) {
  if (!reviewId) {
    throw new Error("Review ID is required.");
  }

  return apiDelete(
    `/api/reviews/${encodeURIComponent(
      reviewId
    )}`
  );
}

/**
 * Calculate average rating locally.
 *
 * @param {Array} reviews
 * @returns {number}
 */
export function calculateAverageRating(
  reviews
) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return 0;
  }

  const validRatings = reviews
    .map((review) => Number(review?.rating))
    .filter(
      (rating) =>
        Number.isFinite(rating) &&
        rating >= 1 &&
        rating <= 5
    );

  if (validRatings.length === 0) {
    return 0;
  }

  const total = validRatings.reduce(
    (sum, rating) => sum + rating,
    0
  );

  return Number(
    (total / validRatings.length).toFixed(1)
  );
}

/**
 * Get rating distribution.
 *
 * Returns:
 * {
 *   5: 10,
 *   4: 5,
 *   3: 2,
 *   2: 1,
 *   1: 0
 * }
 */
export function getRatingDistribution(
  reviews
) {
  const distribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  if (!Array.isArray(reviews)) {
    return distribution;
  }

  reviews.forEach((review) => {
    const rating = Number(review?.rating);

    if (
      Number.isInteger(rating) &&
      rating >= 1 &&
      rating <= 5
    ) {
      distribution[rating] += 1;
    }
  });

  return distribution;
}

/**
 * Validate review before submitting.
 */
export function validateReview({
  rating,
  comment = "",
}) {
  const errors = {};

  const numericRating = Number(rating);

  if (
    !Number.isFinite(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    errors.rating =
      "Please select a rating between 1 and 5.";
  }

  if (comment.length > 1000) {
    errors.comment =
      "Review cannot exceed 1000 characters.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}