"use client"

import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  Zap,
  ArrowLeftRight,
  ChevronLeft
} from "lucide-react"
import { useSidebar } from "@/context/SidebarContext"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    section: "Main",
    items: [
      { to: "/dashboard/overview", icon: LayoutDashboard, label: "Overview" },
      { to: "/dashboard/products", icon: Package, label: "Products" },
      { to: "/dashboard/orders", icon: ShoppingCart, label: "Orders" },
    ]
  },
  {
    section: "Management",
    items: [
      { to: "/dashboard/wallets", icon: Wallet, label: "Wallets" },
      { to: "/dashboard/transactions", icon: ArrowLeftRight, label: "Transactions" },
    ]
  }
]

export default function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center w-full")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl app-gradient-primary shadow-lg transition-transform duration-200 hover:scale-105">
            <Zap className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <span className="text-lg font-bold tracking-tight">eShop</span>
              <span className="ml-1 text-xs font-medium text-sidebar-foreground/60">Admin</span>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Toggle button when collapsed */}
      {isCollapsed && (
        <div className="flex justify-center p-2 border-b border-sidebar-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        {navItems.map((group, groupIndex) => (
          <div key={group.section} className={cn(groupIndex > 0 && "mt-6")}>
            {!isCollapsed && (
              <div className="px-3 mb-2">
                <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                  {group.section}
                </p>
              </div>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isCollapsed && "justify-center"
                    )
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && !isCollapsed && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-sidebar-primary-foreground rounded-r-full" />
                      )}
                      <item.icon className={cn("h-5 w-5 flex-shrink-0", !isActive && "group-hover:scale-110 transition-transform")} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        {!isCollapsed ? (
          <p className="text-xs text-sidebar-foreground/50 text-center">Electronics Dashboard v1.0</p>
        ) : (
          <div className="flex justify-center">
            <div className="h-1 w-1 rounded-full bg-sidebar-foreground/30" />
          </div>
        )}
      </div>
    </aside>
  )
}
