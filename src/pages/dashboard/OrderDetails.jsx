"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ordersService } from "@/services/orders"
import { productsService } from "@/services/products"
import { formatCurrency, formatDate } from "@/lib/utils"
import PageHeader from "@/components/shared/PageHeader"
import LoadingState from "@/components/shared/LoadingState"
import EmptyState from "@/components/shared/EmptyState"
import ProductImage from "@/components/shared/ProductImage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { ShoppingCart, Mail, Calendar, Package, Hash, ArrowLeft, AlertCircle } from "lucide-react"

export default function OrderDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchOrderDetails()
    }, [id])

    const fetchOrderDetails = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const [orderData, productsData] = await Promise.all([ordersService.getById(id), productsService.getAll()])
            setOrder(orderData)
            setProducts(productsData)
        } catch (err) {
            setError("Order not found")
            toast.error("Failed to load order details")
        } finally {
            setIsLoading(false)
        }
    }

    const getProductById = (productId) => {
        return products.find((p) => p.id === productId || p.id === String(productId))
    }

    const getProductDescription = (item) => {
        const product = getProductById(item.productId)
        if (product?.description) return product.description
        return `High-quality electronics product: ${item.productName || "Unknown"}`
    }

    const calculateLineTotal = (item) => {
        return item.quantity * item.price
    }

    const calculateOrderTotal = () => {
        if (!order?.items) return 0
        return order.items.reduce((sum, item) => sum + calculateLineTotal(item), 0)
    }

    if (isLoading) {
        return <LoadingState message="Loading order details..." />
    }

    if (error || !order) {
        return (
            <div className="space-y-6">
                <PageHeader title="Order Details" description="View order information" backLink="/dashboard/orders" />
                <EmptyState
                    icon={AlertCircle}
                    title="Order Not Found"
                    description="The order you're looking for doesn't exist or has been deleted."
                >
                    <Button onClick={() => navigate("/dashboard/orders")} className="gap-2 mt-4">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Orders
                    </Button>
                </EmptyState>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                title={`Order #${order.id}`}
                description="View order details and items"
                backLink="/dashboard/orders"
            />

            {/* Order Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-2 card-hover-glow">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-primary/10 p-3">
                                <Hash className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Order ID</p>
                                <p className="text-xl font-bold">#{order.id}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 card-hover-glow">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-blue-500/10 p-3">
                                <Mail className="h-5 w-5 text-blue-500" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-muted-foreground">Customer</p>
                                <p className="text-sm font-semibold truncate">{order.customerEmail}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 card-hover-glow">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-green-500/10 p-3">
                                <Package className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Items</p>
                                <p className="text-xl font-bold">{order.items?.length || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 card-hover-glow">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-amber-500/10 p-3">
                                <Calendar className="h-5 w-5 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Date</p>
                                <p className="text-sm font-semibold">{formatDate(order.createdAt)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Order Items Table */}
            <Card className="border-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        Order Items
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {order.items && order.items.length > 0 ? (
                        <div className="rounded-lg border-2 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <TableHead className="w-[80px]">Image</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="hidden md:table-cell">Description</TableHead>
                                        <TableHead className="text-center w-[100px]">Qty</TableHead>
                                        <TableHead className="text-right w-[120px]">Unit Price</TableHead>
                                        <TableHead className="text-right w-[120px]">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.items.map((item, index) => {
                                        const product = getProductById(item.productId)
                                        const productName = item.productName || product?.name || "Unknown Product"
                                        return (
                                            <TableRow key={index} className="transition-colors hover:bg-muted/30">
                                                <TableCell>
                                                    <ProductImage productName={productName} size="sm" className="rounded-lg" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <p className="font-medium">{productName}</p>
                                                        {product?.sku && (
                                                            <Badge variant="outline" className="text-xs font-mono">
                                                                {product.sku}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <p className="text-sm text-muted-foreground line-clamp-2">{getProductDescription(item)}</p>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="secondary" className="font-mono">
                                                        {item.quantity}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-medium">{formatCurrency(item.price)}</TableCell>
                                                <TableCell className="text-right font-bold text-primary">
                                                    {formatCurrency(calculateLineTotal(item))}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <EmptyState icon={Package} title="No items" description="This order has no items." />
                    )}
                </CardContent>
            </Card>

            {/* Order Total */}
            <Card className="border-2 bg-gradient-to-r from-primary/5 to-transparent">
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Order Summary</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{order.items?.length || 0} items</span>
                                <Separator orientation="vertical" className="h-4" />
                                <span>Taxes & Fees: {formatCurrency(0)}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                            <p className="text-3xl font-bold text-primary">{formatCurrency(calculateOrderTotal())}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
