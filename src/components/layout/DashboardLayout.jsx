/**
 * ============================================================
 * DASHBOARD LAYOUT - Main Layout for Protected Pages
 * ============================================================
 * 
 * PURPOSE:
 * Provides the consistent layout structure for all dashboard pages.
 * Contains the sidebar, topbar, and main content area.
 * 
 * KEY CONCEPT: OUTLET
 * The <Outlet /> component from React Router renders the matched
 * child route. This is how nested routing works:
 * 
 * - DashboardLayout is the parent
 * - Each dashboard page (Overview, Products, etc.) is a child
 * - The child renders inside <Outlet />
 * 
 * LAYOUT STRUCTURE:
 * ┌─────────────────────────────────────────┐
 * │  Sidebar  │         Topbar              │
 * │           ├─────────────────────────────│
 * │           │                             │
 * │           │         <Outlet />          │
 * │           │      (Page Content)         │
 * │           │                             │
 * └───────────┴─────────────────────────────┘
 * 
 * RESPONSIVE SIDEBAR:
 * - Uses SidebarContext to track collapsed state
 * - Main content margin adjusts based on sidebar width
 * - ml-20 (80px) when collapsed, ml-64 (256px) when expanded
 * ============================================================
 */

import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import { useSidebar } from "@/context/SidebarContext"
import { cn } from "@/lib/utils"

/**
 * DASHBOARD LAYOUT COMPONENT
 * Wraps all dashboard pages with consistent navigation.
 */
export default function DashboardLayout() {
  // Get sidebar collapsed state from context
  const { isCollapsed } = useSidebar()

  return (
    <div className="min-h-screen bg-background">
      {/* ========================================
          SIDEBAR
          Fixed on the left side of the screen.
          Can be collapsed/expanded.
          ======================================== */}
      <Sidebar />

      {/* ========================================
          MAIN CONTENT AREA
          Positioned to the right of sidebar.
          Margin adjusts based on sidebar state.
          ======================================== */}
      <div
        className={cn(
          "transition-all duration-300", // Smooth transition when sidebar toggles
          isCollapsed ? "ml-20" : "ml-64" // 80px or 256px margin-left
        )}
      >
        {/* Top navigation bar */}
        <Topbar />

        {/* ========================================
            MAIN CONTENT - OUTLET
            This is where child routes render!
            
            When you navigate to /dashboard/products,
            the Products component renders HERE.
            ======================================== */}
        <main className="p-6 animate-fade-in max-w-[1600px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
