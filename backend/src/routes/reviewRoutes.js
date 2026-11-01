import express from "express";

import {
  createReview,
  getPlaceReviews,
  getTripReviews,
  getMyReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/*
 * Create review
 */
router.post(
  "/",
  authMiddleware,
  createReview
);

/*
 * Get reviews for a place
 */
router.get(
  "/place/:placeId",
  getPlaceReviews
);

/*
 * Get reviews for a trip
 */
router.get(
  "/trip/:tripId",
  getTripReviews
);

/*
 * Get logged-in user's reviews
 */
router.get(
  "/my",
  authMiddleware,
  getMyReviews
);

/*
 * Update review
 */
router.put(
  "/:reviewId",
  authMiddleware,
  updateReview
);

/*
 * Delete review
 */
router.delete(
  "/:reviewId",
  authMiddleware,
  deleteReview
);

export default router;