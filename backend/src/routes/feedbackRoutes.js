import express from "express";

import {
  createFeedback,
  getMyFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
} from "../controllers/feedbackController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createFeedback
);

router.get(
  "/my",
  authMiddleware,
  getMyFeedback
);

router.get(
  "/:feedbackId",
  authMiddleware,
  getFeedbackById
);

router.put(
  "/:feedbackId",
  authMiddleware,
  updateFeedback
);

router.delete(
  "/:feedbackId",
  authMiddleware,
  deleteFeedback
);

export default router;