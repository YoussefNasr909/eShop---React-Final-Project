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
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || "/dashboard/overview"

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard/overview", { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const result = await login(email, password)

    if (result.success) {
      toast.success("Welcome back!")
      navigate("/dashboard/overview", { replace: true })
    } else {
      toast.error(result.error)
    }

    setIsSubmitting(false)
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

      <Card className="relative w-full max-w-md border-2 shadow-2xl card-hover-glow animate-fade-in">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-bondi-blue-500 to-cerulean-500 shadow-lg">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">eShop Admin</CardTitle>
          <CardDescription className="text-base">Sign in to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@eshop.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-11 border-2 transition-all duration-200 focus:border-primary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 h-11 border-2 transition-all duration-200 focus:border-primary"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
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
