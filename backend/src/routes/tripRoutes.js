import express from "express";

import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  addItineraryItem,
  updateItineraryItem,
  deleteItineraryItem,
  saveTripBudget,
  getTripBudget,
  completeTrip,
} from "../controllers/tripController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getTrips
);

router.post(
  "/",
  authMiddleware,
  createTrip
);

router.get(
  "/:tripId",
  authMiddleware,
  getTripById
);

router.put(
  "/:tripId",
  authMiddleware,
  updateTrip
);

router.delete(
  "/:tripId",
  authMiddleware,
  deleteTrip
);

router.post(
  "/:tripId/itinerary",
  authMiddleware,
  addItineraryItem
);

router.put(
  "/:tripId/itinerary/:itemId",
  authMiddleware,
  updateItineraryItem
);

router.delete(
  "/:tripId/itinerary/:itemId",
  authMiddleware,
  deleteItineraryItem
);

router.get(
  "/:tripId/budget",
  authMiddleware,
  getTripBudget
);

router.put(
  "/:tripId/budget",
  authMiddleware,
  saveTripBudget
);

router.put(
  "/:tripId/complete",
  authMiddleware,
  completeTrip
);

export default router;