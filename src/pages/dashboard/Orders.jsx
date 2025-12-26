"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { ordersService } from "@/services/orders"
import { formatCurrency, formatDate } from "@/lib/utils"
import PageHeader from "@/components/shared/PageHeader"
import LoadingState from "@/components/shared/LoadingState"
import EmptyState from "@/components/shared/EmptyState"
import ConfirmDeleteDialog from "@/components/shared/ConfirmDeleteDialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import {
  ShoppingCart,
  Trash2,
  Eye,
  Search,
  Filter,
  X,
  ArrowUpDown,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

export default function Orders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [minItems, setMinItems] = useState("")
  const [maxItems, setMaxItems] = useState("")
  const [sortBy, setSortBy] = useState("date-desc")
  const [showFilters, setShowFilters] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const debouncedSearch = useDebounce(searchQuery, 300)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const data = await ordersService.getAll()
      setOrders(data)
    } catch (error) {
      toast.error("Failed to load orders")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      setIsDeleting(true)
      await ordersService.delete(deleteTarget.id)
      setOrders((prev) => prev.filter((o) => o.id !== deleteTarget.id))
      toast.success("Order deleted successfully")
    } catch (error) {
      toast.error("Failed to delete order")
    } finally {
      setIsDeleting(false)
      setDeleteTarget(null)
    }
  }

  const clearFilters = useCallback(() => {
    setSearchQuery("")
    setDateFilter("all")
    setMinPrice("")
    setMaxPrice("")
    setMinItems("")
    setMaxItems("")
    setSortBy("date-desc")
    setCurrentPage(1)
  }, [])

  const hasActiveFilters = useMemo(() => {
    return (
      debouncedSearch || dateFilter !== "all" || minPrice || maxPrice || minItems || maxItems || sortBy !== "date-desc"
    )
  }, [debouncedSearch, dateFilter, minPrice, maxPrice, minItems, maxItems, sortBy])

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let result = [...orders]

    // Search filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase()
      result = result.filter(
        (order) => order.customerEmail?.toLowerCase().includes(query) || String(order.id).includes(query),
      )
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const daysMap = {
        "7days": 7,
        "30days": 30,
        "90days": 90,
      }
      const days = daysMap[dateFilter]
      if (days) {
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
        result = result.filter((order) => new Date(order.createdAt) >= cutoff)
      }
    }

    // Price filter
    if (minPrice) {
      result = result.filter((order) => order.totalAmount >= Number(minPrice))
    }
    if (maxPrice) {
      result = result.filter((order) => order.totalAmount <= Number(maxPrice))
    }

    // Items count filter
    if (minItems) {
      result = result.filter((order) => (order.items?.length || 0) >= Number(minItems))
    }
    if (maxItems) {
      result = result.filter((order) => (order.items?.length || 0) <= Number(maxItems))
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "date-desc":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "price-asc":
          return a.totalAmount - b.totalAmount
        case "price-desc":
          return b.totalAmount - a.totalAmount
        case "items-asc":
          return (a.items?.length || 0) - (b.items?.length || 0)
        case "items-desc":
          return (b.items?.length || 0) - (a.items?.length || 0)
        default:
          return 0
      }
    })

    return result
  }, [orders, debouncedSearch, dateFilter, minPrice, maxPrice, minItems, maxItems, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredOrders.slice(start, start + itemsPerPage)
  }, [filteredOrders, currentPage])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, dateFilter, minPrice, maxPrice, minItems, maxItems, sortBy])

  if (isLoading) {
    return <LoadingState message="Loading orders..." />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Orders"
        description="View and manage customer orders"
        actionLabel="Create Order"
        actionLink="/dashboard/orders/new"
      />

      {/* Search and Filter Controls */}
      <Card className="border-2">
        <CardContent className="pt-6 space-y-4">
          {/* Search Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 border-2"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`gap-2 border-2 ${showFilters ? "bg-primary/10 border-primary" : ""}`}
              >
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">
                    !
                  </Badge>
                )}
              </Button>
              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="gap-2">
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-4 border-t animate-fade-in">
              {/* Date Filter */}
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Date Range
                </Label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="border-2 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> Price Range
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="border-2 h-9"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="border-2 h-9"
                  />
                </div>
              </div>

              {/* Items Count */}
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1">
                  <Package className="h-3 w-3" /> Items Count
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minItems}
                    onChange={(e) => setMinItems(e.target.value)}
                    className="border-2 h-9"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxItems}
                    onChange={(e) => setMaxItems(e.target.value)}
                    className="border-2 h-9"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1">
                  <ArrowUpDown className="h-3 w-3" /> Sort By
                </Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="border-2 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Date (Newest)</SelectItem>
                    <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                    <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                    <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                    <SelectItem value="items-desc">Items (Most)</SelectItem>
                    <SelectItem value="items-asc">Items (Least)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {paginatedOrders.length} of {filteredOrders.length} orders
          {hasActiveFilters && ` (filtered from ${orders.length})`}
        </span>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title={hasActiveFilters ? "No matching orders" : "No orders yet"}
          description={
            hasActiveFilters
              ? "Try adjusting your filters to find what you're looking for."
              : "Orders will appear here when customers make purchases."
          }
        >
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="mt-4 gap-2 bg-transparent">
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </EmptyState>
      ) : (
        <Card className="border-2">
          <div className="rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[100px]">Order ID</TableHead>
                  <TableHead>Customer Email</TableHead>
                  <TableHead className="text-center w-[100px]">Items</TableHead>
                  <TableHead className="text-right w-[130px]">Total</TableHead>
                  <TableHead className="w-[130px]">Date</TableHead>
                  <TableHead className="text-right w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="transition-colors hover:bg-muted/30 cursor-pointer"
                    onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                  >
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        #{order.id}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{order.customerEmail}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{order.items?.length || 0} items</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground text-sm">{formatDate(order.createdAt)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/dashboard/orders/${order.id}`)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteTarget(order)
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Order"
        description={`Are you sure you want to delete order #${deleteTarget?.id}? This action cannot be undone.`}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}
