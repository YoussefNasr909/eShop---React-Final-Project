/**
 * ============================================================
 * AUTH CONTEXT - Authentication State Management
 * ============================================================
 * 
 * PURPOSE:
 * Provides authentication state and functions throughout the app.
 * Uses React Context to avoid prop drilling.
 * 
 * FEATURES:
 * - Mock login (for demo purposes)
 * - Session-based storage (clears when browser closes)
 * - Global access to auth state via useAuth() hook
 * 
 * WHY CONTEXT:
 * - Many components need to know if user is logged in
 * - Passing props through many levels is tedious (prop drilling)
 * - Context provides global state that any component can access
 * 
 * WHY SESSIONSTORAGE (not localStorage):
 * - sessionStorage clears when browser tab closes
 * - This means users must re-login each session
 * - Suitable for demo; real app would use JWT tokens
 * ============================================================
 */

"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Create the context object
// This will hold our auth state and functions
const AuthContext = createContext(null)

/**
 * MOCK ADMIN CREDENTIALS
 * In a real application, this would be validated against a backend API.
 * For this demo, we hardcode the credentials.
 * 
 * Login with:
 * - Email: admin@eshop.com
 * - Password: admin123
 */
const MOCK_ADMIN = {
  email: "admin@eshop.com",
  password: "admin123",
  name: "Admin User",
}

/**
 * AUTH PROVIDER COMPONENT
 * Wraps the entire app to provide auth state to all children.
 * 
 * STATE:
 * - user: Current logged-in user object (or null)
 * - isLoading: True while checking sessionStorage on mount
 * 
 * FUNCTIONS PROVIDED:
 * - login(email, password): Validate and log in
 * - logout(): Clear session and log out
 * - isAuthenticated: Boolean derived from user state
 */
export function AuthProvider({ children }) {
  // Current user state (null = not logged in)
  const [user, setUser] = useState(null)

  // Loading state (true while checking storage)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * CHECK FOR EXISTING SESSION ON MOUNT
   * When the app loads, check if there's a saved user in sessionStorage.
   * This allows users to stay logged in during page refreshes.
   */
  useEffect(() => {
    // Try to get user from sessionStorage
    const storedUser = sessionStorage.getItem("eshop_user")

    if (storedUser) {
      // Parse and set the user state
      setUser(JSON.parse(storedUser))
    }

    // Done loading - we now know if user is logged in or not
    setIsLoading(false)
  }, []) // Empty array = run once on mount

  /**
   * LOGIN FUNCTION
   * Validates credentials and logs the user in.
   * 
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {object} - { success: true } or { success: false, error: "message" }
   */
  const login = async (email, password) => {
    // Validate against mock credentials
    if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
      // Create user data (don't include password!)
      const userData = { email: MOCK_ADMIN.email, name: MOCK_ADMIN.name }

      // Update state
      setUser(userData)

      // Save to sessionStorage for persistence during session
      sessionStorage.setItem("eshop_user", JSON.stringify(userData))

      return { success: true }
    }

    // Invalid credentials
    return { success: false, error: "Invalid email or password" }
  }

  /**
   * LOGOUT FUNCTION
   * Clears the user session and logs out.
   */
  const logout = () => {
    // Clear state
    setUser(null)

    // Remove from storage
    sessionStorage.removeItem("eshop_user")
  }

  // Provide auth state and functions to all children
  return (
    <AuthContext.Provider
      value={{
        user,                          // Current user object
        isLoading,                     // Loading state
        login,                         // Login function
        logout,                        // Logout function
        isAuthenticated: !!user        // Boolean: true if user exists
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/**
 * USEAUTH HOOK
 * Custom hook to access auth context from any component.
 * 
 * USAGE:
 * const { user, login, logout, isAuthenticated } = useAuth()
 * 
 * @returns {object} - Auth context value
 * @throws {Error} - If used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)

  // Safety check: ensure hook is used within provider
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
