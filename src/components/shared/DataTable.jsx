import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import EmptyState from "./EmptyState"
import LoadingState from "./LoadingState"

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
  if (isLoading) {
    return <LoadingState />
  }

  if (!data || data.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
  }

  return (
    <Card className="app-card-flat shadow-md">
      <div className={cn("overflow-x-auto", stickyHeader && "max-h-[600px] overflow-y-auto")}>
        <Table>
          <TableHeader className={cn(stickyHeader && "sticky top-0 z-10 bg-muted/80 backdrop-blur-sm")}>
            <TableRow className="bg-muted/80 hover:bg-muted/80 border-b-2">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "font-semibold text-foreground h-12",
                    column.className
                  )}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className={cn(zebra && "table-zebra")}>
            {data.map((row, rowIndex) => (
              <TableRow
                key={row.id || rowIndex}
                className={cn(
                  "border-b transition-all duration-150",
                  "hover:bg-primary/5 hover:shadow-sm",
                  !zebra && rowIndex % 2 === 0 && "bg-transparent",
                  !zebra && rowIndex % 2 === 1 && "bg-muted/20"
                )}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn("py-4", column.cellClassName)}
                  >
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
