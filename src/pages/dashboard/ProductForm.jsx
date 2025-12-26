"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { productsService } from "@/services/products"
import PageHeader from "@/components/shared/PageHeader"
import LoadingState from "@/components/shared/LoadingState"
import ProductImage from "@/components/shared/ProductImage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Save, X } from "lucide-react"

export default function ProductForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id

  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
  })

  useEffect(() => {
    if (isEditing) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      const product = await productsService.getById(id)
      setFormData({
        sku: product.sku,
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        quantity: product.quantity.toString(),
        category: product.category || "",
      })
    } catch (error) {
      toast.error("Failed to load product")
      navigate("/dashboard/products")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required"
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    const price = Number.parseFloat(formData.price)
    if (isNaN(price) || price < 0) {
      newErrors.price = "Price must be 0 or greater"
    }

    const quantity = Number.parseInt(formData.quantity)
    if (isNaN(quantity) || quantity < 0) {
      newErrors.quantity = "Quantity must be 0 or greater"
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

      const productData = {
        sku: formData.sku.trim(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number.parseFloat(formData.price),
        quantity: Number.parseInt(formData.quantity),
        category: formData.category.trim(),
      }

      if (isEditing) {
        await productsService.update(id, productData)
        toast.success("Product updated successfully")
      } else {
        await productsService.create(productData)
        toast.success("Product created successfully")
      }

      navigate("/dashboard/products")
    } catch (error) {
      toast.error(isEditing ? "Failed to update product" : "Failed to create product")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading product..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? "Edit Product" : "Add Product"}
        description={isEditing ? "Update product details" : "Add a new product to your inventory"}
        backLink="/dashboard/products"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {isEditing && formData.name && (
          <Card className="lg:col-span-1 border-2">
            <CardHeader>
              <CardTitle className="text-base">Product Image</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ProductImage productName={formData.name} size="xl" />
            </CardContent>
          </Card>
        )}

        <Card className={`border-2 ${isEditing ? "lg:col-span-2" : "lg:col-span-3 max-w-2xl"}`}>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-sm font-medium">
                    SKU *
                  </Label>
                  <Input
                    id="sku"
                    name="sku"
                    placeholder="ELEC-001"
                    value={formData.sku}
                    onChange={handleChange}
                    className={`h-10 border-2 font-mono ${errors.sku ? "border-destructive" : ""}`}
                  />
                  {errors.sku && <p className="text-sm text-destructive">{errors.sku}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category
                  </Label>
                  <Input
                    id="category"
                    name="category"
                    placeholder="Electronics"
                    value={formData.category}
                    onChange={handleChange}
                    className="h-10 border-2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Product name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`h-10 border-2 ${errors.name ? "border-destructive" : ""}`}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Product description..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="border-2 resize-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium">
                    Price ($) *
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                    className={`h-10 border-2 ${errors.price ? "border-destructive" : ""}`}
                  />
                  {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-sm font-medium">
                    Quantity *
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    className={`h-10 border-2 ${errors.quantity ? "border-destructive" : ""}`}
                  />
                  {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/products")}
                  className="gap-2 border-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
