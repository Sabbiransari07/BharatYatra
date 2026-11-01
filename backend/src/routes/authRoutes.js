import express from "express";

import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  updateProfileImage,
} from "../controllers/authController.js";

import uploadProfileImage from "../middleware/uploadMiddleware.js";

import { validateRegister } from "../validators/authValidator.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Register
router.post("/register", validateRegister, registerUser);

// Login
router.post("/login", loginUser);

// Get current logged-in user
router.get("/me", authMiddleware, getMe);

// Update profile
router.put("/profile", authMiddleware, updateProfile);

router.put(
  "/profile-image",
  authMiddleware,
  uploadProfileImage.single("profileImage"),
  updateProfileImage
);

export default router;