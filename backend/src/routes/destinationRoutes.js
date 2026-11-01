import express from "express";
import { getDestinationData } from "../controllers/destinationController.js";

const router = express.Router();

// Get complete destination/state data
// Example:
// /api/destination?query=Uttar%20Pradesh
router.get("/", getDestinationData);

export default router;