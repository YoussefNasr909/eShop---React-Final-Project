/**
 * ============================================================
 * PROTECTED ROUTE - Authentication Guard Component
 * ============================================================
 * 
 * PURPOSE:
 * Protects routes that require authentication.
 * If user is not logged in, redirects to login page.
 * 
 * HOW IT WORKS:
 * 1. Check if we're still loading auth state
 * 2. If loading, show a spinner
 * 3. If not authenticated, redirect to /login
 * 4. If authenticated, render the children (protected content)
 * 
 * USAGE IN APP.JSX:
 * <Route 
 *   path="/dashboard" 
 *   element={
 *     <ProtectedRoute>
 *       <DashboardLayout />
 *     </ProtectedRoute>
 *   }
 * >
 * 
 * KEY CONCEPTS:
 * - Navigate component: Declarative redirect in React Router
 * - replace prop: Replaces history entry (back button won't return here)
 * - state prop: Saves the intended destination for redirect after login
 * ============================================================
 */

"use client"

import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

/**
 * PROTECTED ROUTE COMPONENT
 * Wraps content that should only be visible to authenticated users.
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - The protected content to render
 */
export default function ProtectedRoute({ children }) {
  // Get auth state from context
  const { isAuthenticated, isLoading } = useAuth()

  // Get current location for "return to" functionality
  const location = useLocation()

  /**
   * LOADING STATE
   * While checking sessionStorage for existing session,
   * show a loading spinner to prevent flash of login page.
   */
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  /**
   * NOT AUTHENTICATED - REDIRECT TO LOGIN
   * If user is not logged in, redirect them to the login page.
   * 
   * - Navigate: React Router component for redirects
   * - to="/login": Destination URL
   * - state={{ from: location }}: Save current location
   *   (so we can redirect back after login)
   * - replace: Don't add to history (prevents back button loop)
   */
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  /**
   * AUTHENTICATED - RENDER PROTECTED CONTENT
   * User is logged in, render the protected children.
   */
  return children
}
