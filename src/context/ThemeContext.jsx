/**
 * ============================================================
 * THEME CONTEXT - Dark/Light Mode Management
 * ============================================================
 * 
 * PURPOSE:
 * Manages the application's color theme (dark or light mode).
 * This is one of the CREATIVE FEATURES required by the project.
 * 
 * FEATURES:
 * - Toggle between dark and light themes
 * - Persists preference in localStorage
 * - Applies theme by adding/removing 'dark' class on HTML element
 * 
 * HOW IT WORKS:
 * 1. On load, check localStorage for saved preference
 * 2. Apply the theme class to document.documentElement
 * 3. When toggled, update state and localStorage
 * 4. Tailwind CSS uses the 'dark' class for dark mode styles
 * 
 * WHY LOCALSTORAGE (not sessionStorage):
 * - Theme preference should persist across sessions
 * - User shouldn't have to re-select theme every visit
 * ============================================================
 */

"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Create the theme context
const ThemeContext = createContext(null)

/**
 * THEME PROVIDER COMPONENT
 * Wraps the app to provide theme state to all children.
 * 
 * STATE:
 * - theme: "light" or "dark"
 * 
 * FUNCTIONS PROVIDED:
 * - toggleTheme(): Switch between light and dark
 */
export function ThemeProvider({ children }) {
  /**
   * INITIALIZE THEME STATE
   * Uses a lazy initializer to read from localStorage only once.
   * Falls back to "light" if no preference is saved.
   */
  const [theme, setTheme] = useState(() => {
    // Check localStorage for saved preference
    const stored = localStorage.getItem("eshop_theme")
    return stored || "light" // Default to light mode
  })

  /**
   * APPLY THEME WHEN IT CHANGES
   * This effect runs whenever 'theme' changes.
   * It updates the DOM and localStorage.
   */
  useEffect(() => {
    // Get the root HTML element
    const root = document.documentElement

    // Add or remove the 'dark' class
    // Tailwind uses this class for dark mode styles
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    // Save preference to localStorage
    localStorage.setItem("eshop_theme", theme)
  }, [theme]) // Re-run when theme changes

  /**
   * TOGGLE THEME FUNCTION
   * Switches between light and dark modes.
   * The useEffect above handles the actual DOM update.
   */
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  // Provide theme state and toggle function to children
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * USETHEME HOOK
 * Custom hook to access theme context from any component.
 * 
 * USAGE:
 * const { theme, toggleTheme } = useTheme()
 * 
 * EXAMPLE:
 * <button onClick={toggleTheme}>
 *   {theme === "dark" ? <Sun /> : <Moon />}
 * </button>
 * 
 * @returns {object} - { theme, toggleTheme }
 * @throws {Error} - If used outside ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext)

  // Safety check
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
