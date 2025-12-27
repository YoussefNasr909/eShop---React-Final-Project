/**
 * ============================================================
 * LOGIN PAGE - Authentication Form
 * ============================================================
 * 
 * PURPOSE:
 * Provides the login form for users to authenticate.
 * This is the entry point to the application.
 * 
 * FEATURES:
 * - Email and password input fields
 * - Form validation (required fields)
 * - Loading state during submission
 * - Toast notifications for success/error
 * - Auto-redirect if already logged in
 * 
 * DEMO CREDENTIALS:
 * - Email: admin@eshop.com
 * - Password: admin123
 * ============================================================
 */

"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Zap, Mail, Lock } from "lucide-react"

export default function Login() {
  // ========================================
  // STATE MANAGEMENT
  // ========================================

  // Form input values
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Loading state for submit button
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ========================================
  // HOOKS
  // ========================================

  // Get login function and auth status from context
  const { login, isAuthenticated } = useAuth()

  // For programmatic navigation after login
  const navigate = useNavigate()

  // Get location for "return to" functionality
  const location = useLocation()

  // Get the page user was trying to access (if redirected from ProtectedRoute)
  // Falls back to dashboard overview if no redirect location
  const from = location.state?.from?.pathname || "/dashboard/overview"

  /**
   * AUTO-REDIRECT IF ALREADY LOGGED IN
   * If user is already authenticated, redirect to dashboard.
   * Prevents logged-in users from seeing the login page.
   */
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard/overview", { replace: true })
    }
  }, [isAuthenticated, navigate])

  /**
   * FORM SUBMISSION HANDLER
   * Validates credentials and logs the user in.
   * Shows toast notification for success/error.
   */
  const handleSubmit = async (e) => {
    // Prevent default form submission (page reload)
    e.preventDefault()

    // Set loading state
    setIsSubmitting(true)

    // Call login function from AuthContext
    const result = await login(email, password)

    if (result.success) {
      // SUCCESS: Show toast and redirect to dashboard
      toast.success("Welcome back!")
      navigate("/dashboard/overview", { replace: true })
    } else {
      // ERROR: Show error message in toast
      toast.error(result.error)
    }

    // Reset loading state
    setIsSubmitting(false)
  }

  // Don't render the form if already authenticated
  // (prevents flash before redirect)
  if (isAuthenticated) {
    return null
  }

  // ========================================
  // RENDER LOGIN FORM
  // ========================================
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      {/* Background gradient decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

      {/* Login Card */}
      <Card className="relative w-full max-w-md border-2 shadow-2xl card-hover-glow animate-fade-in">
        <CardHeader className="text-center pb-2">
          {/* Logo */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-bondi-blue-500 to-cerulean-500 shadow-lg">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">eShop Admin</CardTitle>
          <CardDescription className="text-base">Sign in to access the admin dashboard</CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                {/* Email icon */}
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@eshop.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required  // HTML5 validation
                  className="pl-10 h-11 border-2 transition-all duration-200 focus:border-primary"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                {/* Lock icon */}
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required  // HTML5 validation
                  className="pl-10 h-11 border-2 transition-all duration-200 focus:border-primary"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              disabled={isSubmitting}  // Disable during submission
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Demo Credentials Hint */}
          <div className="mt-6 rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-sm text-muted-foreground">
              Demo: <span className="font-mono text-foreground">admin@eshop.com</span> /{" "}
              <span className="font-mono text-foreground">admin123</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
