import express from "express";
import { searchLocations } from "../controllers/searchController.js";

const router = express.Router();

router.get("/", searchLocations);

export default router;