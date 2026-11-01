// src/services/feedbackService.js

import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
} from "./api";

/**
 * Submit website feedback.
 *
 * Backend:
 * POST /api/feedback
 *
 * Example:
 * {
 *   rating: 5,
 *   category: "website",
 *   message: "Very useful tourism platform."
 * }
 */
export async function submitFeedback(
  feedbackData
) {
  if (
    !feedbackData ||
    typeof feedbackData !== "object"
  ) {
    throw new Error(
      "Feedback data is required."
    );
  }

  const rating = Number(
    feedbackData.rating
  );

  if (
    !Number.isFinite(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    throw new Error(
      "Please provide a rating between 1 and 5."
    );
  }

  const message = String(
    feedbackData.message || ""
  ).trim();

  if (!message) {
    throw new Error(
      "Please enter your feedback."
    );
  }

  if (message.length > 2000) {
    throw new Error(
      "Feedback cannot exceed 2000 characters."
    );
  }

  return apiPost("/api/feedback", {
    ...feedbackData,
    rating,
    message,
  });
}

/**
 * Get feedback submitted by the
 * currently logged-in user.
 *
 * Backend:
 * GET /api/feedback/my
 */
export async function getMyFeedback() {
  return apiGet("/api/feedback/my");
}

/**
 * Get one feedback entry.
 *
 * Backend:
 * GET /api/feedback/:feedbackId
 */
export async function getFeedbackById(
  feedbackId
) {
  if (!feedbackId) {
    throw new Error(
      "Feedback ID is required."
    );
  }

  return apiGet(
    `/api/feedback/${encodeURIComponent(
      feedbackId
    )}`
  );
}

/**
 * Update feedback.
 *
 * Backend:
 * PUT /api/feedback/:feedbackId
 */
export async function updateFeedback(
  feedbackId,
  feedbackData
) {
  if (!feedbackId) {
    throw new Error(
      "Feedback ID is required."
    );
  }

  if (
    !feedbackData ||
    typeof feedbackData !== "object"
  ) {
    throw new Error(
      "Feedback data is required."
    );
  }

  return apiPut(
    `/api/feedback/${encodeURIComponent(
      feedbackId
    )}`,
    feedbackData
  );
}

/**
 * Delete feedback.
 *
 * Backend:
 * DELETE /api/feedback/:feedbackId
 */
export async function deleteFeedback(
  feedbackId
) {
  if (!feedbackId) {
    throw new Error(
      "Feedback ID is required."
    );
  }

  return apiDelete(
    `/api/feedback/${encodeURIComponent(
      feedbackId
    )}`
  );
}

/**
 * Validate feedback before submission.
 */
export function validateFeedback({
  rating,
  message = "",
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

  const cleanMessage =
    String(message || "").trim();

  if (!cleanMessage) {
    errors.message =
      "Please enter your feedback.";
  } else if (cleanMessage.length > 2000) {
    errors.message =
      "Feedback cannot exceed 2000 characters.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Get website rating summary locally.
 *
 * @param {Array} feedbackList
 */
export function calculateFeedbackRating(
  feedbackList
) {
  if (
    !Array.isArray(feedbackList) ||
    feedbackList.length === 0
  ) {
    return {
      average: 0,
      total: 0,
    };
  }

  const ratings = feedbackList
    .map((item) => Number(item?.rating))
    .filter(
      (rating) =>
        Number.isFinite(rating) &&
        rating >= 1 &&
        rating <= 5
    );

  if (ratings.length === 0) {
    return {
      average: 0,
      total: 0,
    };
  }

  const total = ratings.length;

  const average =
    ratings.reduce(
      (sum, rating) => sum + rating,
      0
    ) / total;

  return {
    average: Number(
      average.toFixed(1)
    ),
    total,
  };
}

/**
 * Get rating distribution.
 */
export function getFeedbackDistribution(
  feedbackList
) {
  const distribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  if (!Array.isArray(feedbackList)) {
    return distribution;
  }

  feedbackList.forEach((feedback) => {
    const rating = Number(
      feedback?.rating
    );

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