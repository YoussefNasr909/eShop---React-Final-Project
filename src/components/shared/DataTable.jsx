/**
 * ============================================================
 * DATA TABLE - Reusable Table Component
 * ============================================================
 * 
 * PURPOSE:
 * A generic, reusable table component that can display any data.
 * Used across multiple pages: Products, Wallets, Transactions.
 * 
 * WHY REUSABLE:
 * Instead of writing table code on every page, we use ONE component
 * and configure it with columns and data. This ensures:
 * - Consistent styling across all tables
 * - Easy to maintain (fix bugs in one place)
 * - Less code duplication
 * 
 * FEATURES:
 * - Dynamic columns (defined by parent component)
 * - Custom cell rendering
 * - Loading state handling
 * - Empty state handling
 * - Zebra striping (alternating row colors)
 * - Sticky header option
 * 
 * USAGE EXAMPLE:
 * const columns = [
 *   { key: "name", label: "Product Name" },
 *   { key: "price", label: "Price", render: (row) => formatCurrency(row.price) }
 * ]
 * 
 * <DataTable
 *   columns={columns}
 *   data={products}
 *   isLoading={isLoading}
 *   emptyTitle="No products"
 * />
 * ============================================================
 */

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import EmptyState from "./EmptyState"
import LoadingState from "./LoadingState"

/**
 * DATA TABLE COMPONENT
 * 
 * @param {object} props
 * @param {Array} props.columns - Column definitions
 *   Each column has: { key, label, className?, cellClassName?, render? }
 * @param {Array} props.data - Array of data objects to display
 * @param {boolean} props.isLoading - Show loading state
 * @param {Component} props.emptyIcon - Icon for empty state
 * @param {string} props.emptyTitle - Title for empty state
 * @param {string} props.emptyDescription - Description for empty state
 * @param {boolean} props.stickyHeader - Make header sticky on scroll
 * @param {boolean} props.zebra - Enable zebra striping
 */
export default function DataTable({
  columns,
  data,
  isLoading,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  stickyHeader = false,
  zebra = false
}) {
  // ========================================
  // LOADING STATE
  // Show spinner while data is being fetched
  // ========================================
  if (isLoading) {
    return <LoadingState />
  }

  // ========================================
  // EMPTY STATE
  // Show friendly message when no data
  // ========================================
  if (!data || data.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
  }

  // ========================================
  // RENDER TABLE
  // ========================================
  return (
    <Card className="app-card-flat shadow-md">
      {/* Scrollable container */}
      <div className={cn("overflow-x-auto", stickyHeader && "max-h-[600px] overflow-y-auto")}>
        <Table>
          {/* ========================================
              TABLE HEADER
              Renders column labels
              ======================================== */}
          <TableHeader className={cn(stickyHeader && "sticky top-0 z-10 bg-muted/80 backdrop-blur-sm")}>
            <TableRow className="bg-muted/80 hover:bg-muted/80 border-b-2">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "font-semibold text-foreground h-12",
                    column.className  // Allow custom column width/alignment
                  )}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* ========================================
              TABLE BODY
              Renders data rows
              ======================================== */}
          <TableBody className={cn(zebra && "table-zebra")}>
            {data.map((row, rowIndex) => (
              <TableRow
                key={row.id || rowIndex}  // Prefer row.id if available
                className={cn(
                  "border-b transition-all duration-150",
                  "hover:bg-primary/5 hover:shadow-sm",  // Hover effect
                  // Alternating row colors (when zebra is off)
                  !zebra && rowIndex % 2 === 0 && "bg-transparent",
                  !zebra && rowIndex % 2 === 1 && "bg-muted/20"
                )}
              >
                {/* Render each cell */}
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn("py-4", column.cellClassName)}
                  >
                    {/* Use custom render function if provided, otherwise show raw value */}
                    {column.render ? column.render(row) : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
