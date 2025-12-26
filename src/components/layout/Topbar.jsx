"use client"

import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun, LogOut, User, Settings, ChevronRight } from "lucide-react"

const getPageTitle = (pathname) => {
  const segments = pathname.split("/").filter(Boolean)
  const lastSegment = segments[segments.length - 1]

  if (lastSegment === "dashboard" || lastSegment === "overview") return "Overview"
  if (lastSegment === "products") return "Products"
  if (lastSegment === "orders") return "Orders"
  if (lastSegment === "wallets") return "Wallets"
  if (lastSegment === "transactions") return "Transactions"
  if (lastSegment === "new") return "New Item"

  return "Dashboard"
}

const getPageDescription = (pathname) => {
  const lastSegment = pathname.split("/").filter(Boolean).pop()

  if (lastSegment === "overview") return "Monitor your store performance"
  if (lastSegment === "products") return "Manage your product inventory"
  if (lastSegment === "orders") return "Track and manage customer orders"
  if (lastSegment === "wallets") return "Manage customer wallets and balances"
  if (lastSegment === "transactions") return "View transaction history"

  return "Manage your electronics store"
}

export default function Topbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  const pageTitle = getPageTitle(location.pathname)
  const pageDescription = getPageDescription(location.pathname)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b-2 bg-card/90 backdrop-blur-md px-6 shadow-sm">
      {/* Left: Breadcrumbs/Page Title */}
      <div className="flex items-center gap-2">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hover:text-foreground transition-colors cursor-default">Dashboard</span>
            {pageTitle !== "Dashboard" && pageTitle !== "Overview" && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium">{pageTitle}</span>
              </>
            )}
          </div>
          {pageDescription && (
            <p className="text-xs text-muted-foreground mt-0.5">{pageDescription}</p>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Admin Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 border">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-foreground">Admin</span>
        </div>

        {/* Theme Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="app-btn-icon bg-transparent"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="User menu"
              className="app-btn-icon bg-transparent"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border-2 shadow-xl z-[100] animate-scale-in bg-card/95 backdrop-blur-sm">
            <div className="px-3 py-2.5">
              <p className="text-sm font-semibold text-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Administrator</p>
            </div>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem disabled className="text-muted-foreground">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer font-medium"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
