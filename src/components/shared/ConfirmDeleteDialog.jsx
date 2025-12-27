/**
 * ============================================================
 * CONFIRM DELETE DIALOG - Reusable Delete Confirmation
 * ============================================================
 * 
 * PURPOSE:
 * Shows a confirmation dialog before deleting items.
 * Prevents accidental deletions by requiring user confirmation.
 * 
 * WHY REUSABLE:
 * Multiple pages need delete confirmation (Products, Orders).
 * One component ensures consistent experience and messaging.
 * 
 * FEATURES:
 * - Warning icon and styling
 * - Customizable title and description
 * - Cancel and Confirm buttons
 * - Loading state during deletion
 * 
 * USAGE EXAMPLE:
 * <ConfirmDeleteDialog
 *   open={showDialog}
 *   onOpenChange={setShowDialog}
 *   title="Delete Product?"
 *   description="This will permanently remove the product."
 *   onConfirm={handleDelete}
 *   isDeleting={isDeleting}
 * />
 * ============================================================
 */

"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle } from "lucide-react"

/**
 * CONFIRM DELETE DIALOG COMPONENT
 * 
 * @param {object} props
 * @param {boolean} props.open - Whether dialog is visible
 * @param {function} props.onOpenChange - Callback when open state changes
 * @param {string} props.title - Dialog title (optional, has default)
 * @param {string} props.description - Dialog description (optional, has default)
 * @param {function} props.onConfirm - Callback when user confirms deletion
 * @param {boolean} props.isDeleting - Loading state for delete operation
 */
export default function ConfirmDeleteDialog({ open, onOpenChange, title, description, onConfirm, isDeleting }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-2">
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            {/* ========================================
                WARNING ICON
                Red circle with alert triangle
                ======================================== */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>

            {/* ========================================
                DIALOG CONTENT
                Title and description
                ======================================== */}
            <div className="space-y-2">
              <AlertDialogTitle className="text-lg">
                {title || "Are you sure?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {description || "This action cannot be undone. This will permanently delete this item."}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {/* ========================================
            DIALOG ACTIONS
            Cancel and Delete buttons
            ======================================== */}
        <AlertDialogFooter className="mt-4">
          {/* Cancel button - closes dialog */}
          <AlertDialogCancel disabled={isDeleting} className="border-2">
            Cancel
          </AlertDialogCancel>

          {/* Delete button - calls onConfirm */}
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-200"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
