// src/services/authService.js

import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
} from "./api";

/**
 * Register new user
 */
export async function registerUser(userData) {
  return apiPost("/api/auth/register", userData);
}

/**
 * Login user
 */
export async function loginUser(credentials) {
  return apiPost("/api/auth/login", credentials);
}

/**
 * Get currently logged-in user
 */
export async function getCurrentUser() {
  return apiGet("/api/auth/me");
}

/**
 * Update user profile
 */
export async function updateProfile(profileData) {
  return apiPut("/api/auth/profile", profileData);
}

/**
 * Upload profile image
 */
export async function uploadProfileImage(file) {
  const formData = new FormData();

  formData.append("profileImage", file);

  return apiPut("/api/auth/profile-image", formData);
}

/**
 * Delete user account
 */
export async function deleteAccount() {
  return apiDelete("/api/auth/account");
}

/**
 * Save authentication token
 */
export function saveToken(token) {
  if (token) {
    localStorage.setItem("token", token);
  }
}

/**
 * Get authentication token
 */
export function getToken() {
  return localStorage.getItem("token");
}

/**
 * Remove authentication token
 */
export function removeToken() {
  localStorage.removeItem("token");
}

/**
 * Logout user
 */
export function logoutUser() {
  removeToken();
}