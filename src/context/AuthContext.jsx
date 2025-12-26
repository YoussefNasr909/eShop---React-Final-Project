"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

// Mock admin credentials
const MOCK_ADMIN = {
  email: "admin@eshop.com",
  password: "admin123",
  name: "Admin User",
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = sessionStorage.getItem("eshop_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    // Mock login validation
    if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
      const userData = { email: MOCK_ADMIN.email, name: MOCK_ADMIN.name }
      setUser(userData)
      sessionStorage.setItem("eshop_user", JSON.stringify(userData))
      return { success: true }
    }
    return { success: false, error: "Invalid email or password" }
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem("eshop_user")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
