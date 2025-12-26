"use client"

import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { productsService } from "@/services/products"
import { formatCurrency } from "@/lib/utils"
import PageHeader from "@/components/shared/PageHeader"
import DataTable from "@/components/shared/DataTable"
import SearchFilter from "@/components/shared/SearchFilter"
import ConfirmDeleteDialog from "@/components/shared/ConfirmDeleteDialog"
import ProductImage from "@/components/shared/ProductImage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Package, Pencil, Trash2, Filter, X } from "lucide-react"

export default function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [stockFilter, setStockFilter] = useState("all")
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const data = await productsService.getAll()
      setProducts(data)
    } catch (error) {
      toast.error("Failed to load products")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchLower = search.toLowerCase()
      const matchesSearch =
        product.sku.toLowerCase().includes(searchLower) || product.name.toLowerCase().includes(searchLower)
      const matchesMinPrice = !minPrice || product.price >= Number.parseFloat(minPrice)
      const matchesMaxPrice = !maxPrice || product.price <= Number.parseFloat(maxPrice)
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && product.quantity > 0) ||
        (stockFilter === "out-of-stock" && product.quantity === 0)

      return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesStock
    })
  }, [products, search, minPrice, maxPrice, stockFilter])

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      setIsDeleting(true)
      await productsService.delete(deleteTarget.id)
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      toast.success("Product deleted successfully")
    } catch (error) {
      toast.error("Failed to delete product")
    } finally {
      setIsDeleting(false)
      setDeleteTarget(null)
    }
  }

  const clearFilters = () => {
    setSearch("")
    setMinPrice("")
    setMaxPrice("")
    setStockFilter("all")
  }

  const hasActiveFilters = search || minPrice || maxPrice || stockFilter !== "all"

  const columns = [
    {
      key: "image",
      label: "Image",
      className: "w-[70px]",
      render: (row) => <ProductImage productName={row.name} size="sm" />,
    },
    { key: "sku", label: "SKU", className: "w-[120px] font-mono text-xs" },
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <div>
          <p className="font-medium">{row.name}</p>
          {row.category && <p className="text-xs text-muted-foreground">{row.category}</p>}
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      className: "text-right",
      cellClassName: "text-right font-semibold",
      render: (row) => formatCurrency(row.price),
    },
    {
      key: "quantity",
      label: "Stock",
      className: "text-center",
      cellClassName: "text-center",
      render: (row) => (
        <Badge variant={row.quantity > 0 ? "default" : "destructive"} className="font-medium">
          {row.quantity > 0 ? `${row.quantity} in stock` : "Out of stock"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-right w-[100px]",
      cellClassName: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/dashboard/products/${row.id}`)}
            className="h-8 w-8 hover:bg-secondary/50 transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteTarget(row)}
            className="h-8 w-8 hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Products"
        description="Manage your product inventory"
        actionLabel="Add Product"
        actionLink="/dashboard/products/new"
      />

      <Card className="p-4 border-2">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters</span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              {filteredProducts.length} results
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-64">
            <SearchFilter value={search} onChange={setSearch} placeholder="Search by SKU or name..." />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Min Price</Label>
            <Input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-28 h-9 border-2"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Max Price</Label>
            <Input
              type="number"
              placeholder="Any"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-28 h-9 border-2"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Stock Status</Label>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-36 h-9 border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} size="sm" className="h-9 gap-1 border-2 bg-transparent">
              <X className="h-3 w-3" />
              Clear
            </Button>
          )}
        </div>
      </Card>

      <DataTable
        columns={columns}
        data={filteredProducts}
        isLoading={isLoading}
        emptyIcon={Package}
        emptyTitle="No products found"
        emptyDescription="Get started by adding your first product."
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}
