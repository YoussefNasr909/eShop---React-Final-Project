import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import { useSidebar } from "@/context/SidebarContext"
import { cn } from "@/lib/utils"

export default function DashboardLayout() {
  const { isCollapsed } = useSidebar()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          "transition-all duration-300",
          isCollapsed ? "ml-20" : "ml-64"
        )}
      >
        <Topbar />
        <main className="p-6 animate-fade-in max-w-[1600px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
