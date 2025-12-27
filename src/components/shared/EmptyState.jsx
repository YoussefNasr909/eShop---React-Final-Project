/**
 * ============================================================
 * EMPTY STATE - No Data Placeholder Component
 * ============================================================
 * 
 * PURPOSE:
 * Shows a friendly message when there's no data to display.
 * Used in tables, charts, and lists when data is empty.
 * 
 * WHY IMPORTANT:
 * Empty screens can confuse users. This component:
 * - Clearly communicates that there's no data
 * - Provides context with customizable title/description
 * - Can include an action to help users get started
 * 
 * USAGE EXAMPLE:
 * <EmptyState
 *   icon={Package}
 *   title="No products found"
 *   description="Get started by adding your first product."
 *   actionLabel="Add Product"
 *   onAction={() => navigate('/dashboard/products/new')}
 * />
 * ============================================================
 */

"use client"

import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * EMPTY STATE COMPONENT
 * 
 * @param {object} props
 * @param {Component} props.icon - Lucide icon to display (default: Package)
 * @param {string} props.title - Main message (default: "No data")
 * @param {string} props.description - Additional context (optional)
 * @param {string} props.actionLabel - Button text (optional)
 * @param {function} props.onAction - Button click handler (optional)
 */
export default function EmptyState({
  icon: Icon = Package,
  title = "No data",
  description,
  actionLabel,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      {/* ========================================
          ICON CONTAINER
          Large icon with gradient background
          ======================================== */}
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-dashed border-primary/30">
        <Icon className="h-10 w-10 text-primary/60" />
      </div>

      {/* ========================================
          TEXT CONTENT
          Title and optional description
          ======================================== */}
      <h3 className="mt-5 text-xl font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {/* ========================================
          OPTIONAL ACTION BUTTON
          Only renders if both actionLabel and onAction are provided
          ======================================== */}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="mt-5 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
