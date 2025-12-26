"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ordersService } from "@/services/orders"
import { productsService } from "@/services/products"
import { formatCurrency } from "@/lib/utils"
import PageHeader from "@/components/shared/PageHeader"
import LoadingState from "@/components/shared/LoadingState"
import ProductImage from "@/components/shared/ProductImage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Plus, Trash2, ShoppingCart, Mail, Package, Save, X } from "lucide-react"

export default function OrderForm() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [products, setProducts] = useState([])
  const [errors, setErrors] = useState({})

  const [customerEmail, setCustomerEmail] = useState("")
  const [items, setItems] = useState([{ productId: "", quantity: 1 }])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await productsService.getAll()
      setProducts(data)
    } catch (error) {
      toast.error("Failed to load products")
    } finally {
      setIsLoading(false)
    }
  }

  const getProductById = (id) => products.find((p) => p.id === id)

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const product = getProductById(item.productId)
      if (product) {
        return total + product.price * item.quantity
      }
      return total
    }, 0)
  }

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1 }])
  }

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index, field, value) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)

    if (errors.items) {
      setErrors((prev) => ({ ...prev, items: "" }))
    }
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validate = () => {
    const newErrors = {}

    if (!customerEmail.trim()) {
      newErrors.email = "Customer email is required"
    } else if (!validateEmail(customerEmail)) {
      newErrors.email = "Please enter a valid email"
    }

    const validItems = items.filter((item) => item.productId && item.quantity > 0)
    if (validItems.length === 0) {
      newErrors.items = "At least one item is required"
    }

    for (const item of validItems) {
      if (item.quantity <= 0) {
        newErrors.items = "All quantities must be greater than 0"
        break
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      toast.error("Please fix the form errors")
      return
    }

    try {
      setIsSubmitting(true)

      const validItems = items.filter((item) => item.productId && item.quantity > 0)
      const orderItems = validItems.map((item) => {
        const product = getProductById(item.productId)
        return {
          productId: item.productId,
          productName: product.name,
          quantity: Number.parseInt(item.quantity),
          price: product.price,
        }
      })

      const orderData = {
        customerEmail: customerEmail.trim(),
        items: orderItems,
        totalAmount: calculateTotal(),
      }

      await ordersService.create(orderData)
      toast.success("Order created successfully")
      navigate("/dashboard/orders")
    } catch (error) {
      toast.error(error.message || "Failed to create order")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading products..." />
  }

  const availableProducts = products.filter((p) => p.quantity > 0)
  const itemCount = items.filter((item) => item.productId).length

  return (
    <div className="space-y-6">
      <PageHeader title="Create Order" description="Create a new customer order" backLink="/dashboard/orders" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-2">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="customerEmail" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Customer Email *
                </Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="customer@example.com"
                  value={customerEmail}
                  onChange={(e) => {
                    setCustomerEmail(e.target.value)
                    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }))
                  }}
                  className={`h-10 border-2 ${errors.email ? "border-destructive" : ""}`}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    Order Items *
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addItem}
                    className="gap-1 border-2 transition-all duration-200 hover:border-primary bg-transparent"
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                {errors.items && <p className="text-sm text-destructive">{errors.items}</p>}

                <div className="space-y-3">
                  {items.map((item, index) => {
                    const selectedProduct = getProductById(item.productId)
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-xl border-2 p-4 transition-all duration-200 hover:border-muted-foreground/30"
                      >
                        {selectedProduct && (
                          <ProductImage productName={selectedProduct.name} size="sm" className="shrink-0" />
                        )}
                        <div className="flex-1">
                          <Select
                            value={item.productId}
                            onValueChange={(value) => updateItem(index, "productId", value)}
                          >
                            <SelectTrigger className="border-2 h-10">
                              <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableProducts.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{product.name}</span>
                                    <span className="text-muted-foreground">-</span>
                                    <span className="text-primary font-semibold">{formatCurrency(product.price)}</span>
                                    <Badge variant="secondary" className="text-xs">
                                      {product.quantity} in stock
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-24">
                          <Input
                            type="number"
                            min="1"
                            max={selectedProduct?.quantity || 999}
                            value={item.quantity}
                            onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value) || 1)}
                            placeholder="Qty"
                            className="h-10 border-2 text-center"
                          />
                        </div>
                        <div className="w-28 text-right font-bold text-primary">
                          {selectedProduct ? formatCurrency(selectedProduct.price * item.quantity) : "-"}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                          className="h-8 w-8 hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? "Creating Order..." : "Create Order"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/orders")}
                  className="gap-2 border-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-2 card-hover-glow h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {itemCount === 0 ? (
              <div className="text-center py-6">
                <Package className="h-10 w-10 mx-auto text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground mt-2">No items added yet</p>
              </div>
            ) : (
              <>
                {items
                  .filter((item) => item.productId)
                  .map((item, index) => {
                    const product = getProductById(item.productId)
                    return (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {product?.name} <span className="text-foreground font-medium">x {item.quantity}</span>
                        </span>
                        <span className="font-medium">{formatCurrency(product?.price * item.quantity)}</span>
                      </div>
                    )
                  })}
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(calculateTotal())}</span>
                </div>
                <div className="text-xs text-muted-foreground text-center mt-2">
                  {itemCount} {itemCount === 1 ? "item" : "items"} in order
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
