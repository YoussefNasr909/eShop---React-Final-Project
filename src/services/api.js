/**
 * ============================================================
 * API SERVICE - Centralized Axios Instance
 * ============================================================
 * 
 * PURPOSE:
 * Creates a single Axios instance that all other services use.
 * This centralizes API configuration in one place.
 * 
 * WHY WE DO THIS:
 * 1. Single source of truth for API base URL
 * 2. Easy to add headers, interceptors, or authentication
 * 3. Changing the API URL only requires editing ONE file
 * 4. All HTTP requests go through the same configuration
 * 
 * CONFIGURATION:
 * - baseURL: Reads from environment variable, falls back to localhost
 * - headers: Sets JSON content type for all requests
 * 
 * USAGE IN OTHER FILES:
 * import api from "./api"
 * api.get("/products")  // Uses this configured instance
 * ============================================================
 */

import axios from "axios"

// Create a configured Axios instance
// All services import this instead of axios directly
const api = axios.create({
  // Base URL from .env file (VITE_API_BASE_URL)
  // Falls back to localhost:3001 if not defined
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",

  // Default headers for all requests
  headers: {
    "Content-Type": "application/json",
  },
})

// Export the configured instance for use in service files
export default api
