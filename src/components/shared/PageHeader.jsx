/**
 * ============================================================
 * PAGE HEADER - Consistent Page Title Component
 * ============================================================
 * 
 * PURPOSE:
 * Provides a consistent header layout for all dashboard pages.
 * Includes title, description, optional icon, and action button.
 * 
 * WHY REUSABLE:
 * Every page needs a header with similar structure.
 * Instead of duplicating this layout, we use ONE component.
 * 
 * FEATURES:
 * - Page title (h1)
 * - Optional description
 * - Optional icon (from lucide-react)
 * - Optional action button with link
 * 
 * USAGE EXAMPLE:
 * <PageHeader
 *   title="Products"
 *   description="Manage your product inventory"
 *   icon={Package}
 *   actionLabel="Add Product"
 *   actionLink="/dashboard/products/new"
 * />
 * ============================================================
 */

import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

/**
 * PAGE HEADER COMPONENT
 * 
 * @param {object} props
 * @param {string} props.title - Page title (required)
 * @param {string} props.description - Subtitle/description (optional)
 * @param {Component} props.icon - Lucide icon component (optional)
 * @param {string} props.actionLabel - Button text (optional)
 * @param {string} props.actionLink - Button destination URL (optional)
 */
export default function PageHeader({ title, description, actionLabel, actionLink, icon: Icon }) {
  return (
    <div className="flex items-center justify-between app-section">
      {/* ========================================
          LEFT SIDE: Icon + Title + Description
          ======================================== */}
      <div className="flex items-center gap-3">
        {/* Optional icon with gradient background */}
        {Icon && (
          <div className="h-10 w-10 rounded-xl app-gradient-primary flex items-center justify-center shadow-md">
            <Icon className="h-5 w-5 text-white" />
          </div>
        )}
        <div>
          {/* Page title */}
          <h1 className="app-title">{title}</h1>
          {/* Optional description */}
          {description && <p className="app-subtitle">{description}</p>}
        </div>
      </div>

      {/* ========================================
          RIGHT SIDE: Action Button (optional)
          Only renders if both actionLabel and actionLink are provided
          ======================================== */}
      {actionLabel && actionLink && (
        <Button
          asChild  // Renders as child element (Link in this case)
          className="shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] gap-2"
        >
          <Link to={actionLink}>
            <Plus className="h-4 w-4" />
            {actionLabel}
          </Link>
        </Button>
      )}
    </div>
  )
}
