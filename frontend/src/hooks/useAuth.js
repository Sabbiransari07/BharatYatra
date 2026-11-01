// src/hooks/useAuth.js

import { useAuth as useAuthContext } from "../context/AuthContext";

/**
 * Global authentication hook.
 *
 * Provides:
 * - current user
 * - login
 * - register
 * - logout
 * - profile update
 * - profile image upload
 * - account deletion
 * - authentication state
 */
export default function useAuth() {
  return useAuthContext();
}