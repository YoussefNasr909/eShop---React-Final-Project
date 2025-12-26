"use client"

import { createContext, useContext, useState, useEffect } from "react"

const SidebarContext = createContext()

export function SidebarProvider({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem("sidebar-collapsed")
        return saved === "true"
    })

    useEffect(() => {
        localStorage.setItem("sidebar-collapsed", isCollapsed.toString())
    }, [isCollapsed])

    const toggleSidebar = () => setIsCollapsed((prev) => !prev)

    return (
        <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (!context) {
        throw new Error("useSidebar must be used within SidebarProvider")
    }
    return context
}
