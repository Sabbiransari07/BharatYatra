// src/context/AuthContext.jsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
  registerUser,
  updateProfile,
  uploadProfileImage,
  deleteAccount,
  saveToken,
  getToken,
  logoutUser,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /**
   * Load logged-in user when application starts.
   */
  useEffect(() => {
    initializeAuth();
  }, []);

  async function initializeAuth() {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setAuthError(null);

      const data = await getCurrentUser();

      if (data?.success && data?.user) {
        setUser(data.user);
      } else if (data?.user) {
        setUser(data.user);
      } else {
        logoutUser();
        setUser(null);
      }
    } catch (error) {
      console.error(
        "Authentication initialization failed:",
        error
      );

      logoutUser();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Register new user.
   */
  async function register(userData) {
    setAuthError(null);
    setLoading(true);

    try {
      const data = await registerUser(userData);

      if (data?.token) {
        saveToken(data.token);
      }

      if (data?.user) {
        setUser(data.user);
      }

      return data;
    } catch (error) {
      setAuthError(
        error.message || "Registration failed."
      );

      throw error;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Login existing user.
   */
  async function login(credentials) {
    setAuthError(null);
    setLoading(true);

    try {
      const data = await loginUser(credentials);

      if (!data?.token) {
        throw new Error(
          "Login successful but authentication token was not received."
        );
      }

      saveToken(data.token);

      if (data?.user) {
        setUser(data.user);
      } else {
        const currentUser =
          await getCurrentUser();

        if (currentUser?.user) {
          setUser(currentUser.user);
        }
      }

      return data;
    } catch (error) {
      setAuthError(
        error.message || "Login failed."
      );

      throw error;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Logout current user.
   */
  function logout() {
    logoutUser();
    setUser(null);
    setAuthError(null);
  }

  /**
   * Update profile information.
   */
  async function updateUserProfile(profileData) {
    setAuthError(null);

    try {
      const data =
        await updateProfile(profileData);

      if (data?.user) {
        setUser(data.user);
      }

      return data;
    } catch (error) {
      setAuthError(
        error.message ||
          "Unable to update profile."
      );

      throw error;
    }
  }

  /**
   * Upload profile image.
   */
  async function updateProfileImage(file) {
    setAuthError(null);

    try {
      const data =
        await uploadProfileImage(file);

      if (data?.user) {
        setUser(data.user);
      }

      return data;
    } catch (error) {
      setAuthError(
        error.message ||
          "Unable to upload profile image."
      );

      throw error;
    }
  }

  /**
   * Delete current account.
   */
  async function removeAccount() {
    setAuthError(null);

    try {
      const data =
        await deleteAccount();

      logoutUser();
      setUser(null);

      return data;
    } catch (error) {
      setAuthError(
        error.message ||
          "Unable to delete account."
      );

      throw error;
    }
  }

  /**
   * Clear authentication error.
   */
  function clearAuthError() {
    setAuthError(null);
  }

  const value = {
    user,

    isAuthenticated: Boolean(user),

    loading,

    authError,

    register,
    login,
    logout,

    updateUserProfile,
    updateProfileImage,
    removeAccount,

    clearAuthError,

    refreshUser: initializeAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook for accessing authentication context.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}

export default AuthContext;