/**
 * ============================================================
 * LOADING STATE - Data Loading Indicator
 * ============================================================
 * 
 * PURPOSE:
 * Shows a loading spinner while data is being fetched.
 * Provides visual feedback that something is happening.
 * 
 * WHY IMPORTANT:
 * - Prevents users from thinking the app is broken
 * - Gives feedback that data is loading
 * - Consistent loading experience across all pages
 * 
 * USAGE EXAMPLE:
 * if (isLoading) {
 *   return <LoadingState message="Loading products..." />
 * }
 * ============================================================
 */

/**
 * LOADING STATE COMPONENT
 * 
 * @param {object} props
 * @param {string} props.message - Loading message (default: "Loading...")
 */
export default function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      {/* ========================================
          SPINNER ANIMATION
          Outer spinning ring + inner pulsing circle
          ======================================== */}
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>

        {/* Inner pulsing circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse"></div>
        </div>
      </div>

      {/* Loading message */}
      <p className="mt-5 text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  )
}
