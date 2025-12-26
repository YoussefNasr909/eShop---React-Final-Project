"use client"

import { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { productsService } from "@/services/products"
import { ordersService } from "@/services/orders"
import { walletService } from "@/services/wallet"
import { formatCurrency, formatShortDate } from "@/lib/utils"
import PageHeader from "@/components/shared/PageHeader"
import LoadingState from "@/components/shared/LoadingState"
import EmptyState from "@/components/shared/EmptyState"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Package, ShoppingCart, Wallet, TrendingUp, ArrowRight, BarChart3, Users, ArrowLeftRight } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export default function Overview() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [wallets, setWallets] = useState([])
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setIsLoading(true)
      const [productsData, ordersData, walletsData, txnsData] = await Promise.all([
        productsService.getAll(),
        ordersService.getAll(),
        walletService.getAll(),
        walletService.getAllTransactions(),
      ])

      setProducts(productsData)
      setOrders(ordersData)
      setWallets(walletsData)
      setTransactions(txnsData)
    } catch (error) {
      toast.error("Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  const topProducts = useMemo(() => {
    return [...products].sort((a, b) => b.quantity - a.quantity).slice(0, 5)
  }, [products])

  const topWalletsByBalance = useMemo(() => {
    return [...wallets]
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 5)
      .map((w) => ({
        email: w.ownerEmail.split("@")[0],
        balance: w.balance,
      }))
  }, [wallets])

  const transactionChartData = useMemo(() => {
    const grouped = {}

    transactions.forEach((txn) => {
      const date = formatShortDate(txn.createdAt)
      if (!grouped[date]) {
        grouped[date] = { date, deposits: 0, withdrawals: 0 }
      }
      if (txn.type === "deposit") {
        grouped[date].deposits += txn.amount
      } else {
        grouped[date].withdrawals += txn.amount
      }
    })

    return Object.values(grouped).slice(-7)
  }, [transactions])

  const totalProducts = products.length
  const totalOrders = orders.length
  const totalWallets = wallets.length
  const totalTransactions = transactions.length
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0)
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)

  if (isLoading) {
    return <LoadingState message="Loading dashboard..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" description="Welcome to your eShop Admin Dashboard" />

      {/* KPI Cards - Fixed with proper Card components */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Products */}
        <Card className="border-2 bg-card shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl app-gradient-primary flex items-center justify-center shadow-md flex-shrink-0">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <div className="text-3xl font-bold tracking-tight mt-1">{totalProducts}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {products.filter((p) => p.quantity > 0).length}
                  </span>{" "}
                  in stock
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="border-2 bg-card shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl app-gradient-accent flex items-center justify-center shadow-md flex-shrink-0">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <div className="text-3xl font-bold tracking-tight mt-1">{totalOrders}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="text-primary font-semibold">{formatCurrency(totalRevenue)}</span> revenue
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Wallets */}
        <Card className="border-2 bg-card shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl app-gradient-success flex items-center justify-center shadow-md flex-shrink-0">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">Total Wallets</p>
                <div className="text-3xl font-bold tracking-tight mt-1">{totalWallets}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {formatCurrency(totalBalance)}
                  </span>{" "}
                  total balance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Transactions */}
        <Card className="border-2 bg-card shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-tropical-teal-500 to-ocean-mist-500 flex items-center justify-center shadow-md flex-shrink-0">
                <ArrowLeftRight className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                <div className="text-3xl font-bold tracking-tight mt-1">{totalTransactions}</div>
                <p className="text-xs text-muted-foreground mt-2">across all wallets</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Products Chart */}
        <Card className="app-card-flat shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg app-gradient-primary flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              Top Products by Stock
            </CardTitle>
            <CardDescription>Your top 5 products with highest inventory</CardDescription>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <EmptyState icon={BarChart3} title="No products yet" description="Add products to see the chart" />
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={true}
                      vertical={false}
                      stroke="hsl(var(--border))"
                    />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={120}
                      tick={{ fontSize: 11 }}
                      tickFormatter={(value) => (value.length > 15 ? `${value.slice(0, 15)}...` : value)}
                    />
                    <Tooltip
                      formatter={(value) => [`${value} units`, "Quantity"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "2px solid hsl(var(--border))",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar dataKey="quantity" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Wallet Activity Chart */}
        <Card className="app-card-flat shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg app-gradient-success flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              Wallet Activity
            </CardTitle>
            <CardDescription>Deposits and withdrawals across all wallets over time</CardDescription>
          </CardHeader>
          <CardContent>
            {transactionChartData.length === 0 ? (
              <EmptyState
                icon={TrendingUp}
                title="No transactions yet"
                description="Make deposits or withdrawals to see the chart"
              />
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={transactionChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "2px solid hsl(var(--border))",
                        borderRadius: "12px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="deposits"
                      stroke="var(--color-emerald-500)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-emerald-500)", strokeWidth: 2 }}
                      name="Deposits"
                    />
                    <Line
                      type="monotone"
                      dataKey="withdrawals"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2 }}
                      name="Withdrawals"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="app-card-flat shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg app-gradient-success flex items-center justify-center">
              <Wallet className="h-4 w-4 text-white" />
            </div>
            Top Wallets by Balance
          </CardTitle>
          <CardDescription>Your top 5 wallets with highest balances</CardDescription>
        </CardHeader>
        <CardContent>
          {topWalletsByBalance.length === 0 ? (
            <EmptyState icon={Wallet} title="No wallets yet" description="Create wallets to see the chart" />
          ) : (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topWalletsByBalance} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="email" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), "Balance"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "2px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar dataKey="balance" fill="var(--color-emerald-500)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="app-card-flat shadow-md">
        <CardHeader>
          <CardTitle className="app-heading">Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              asChild
              variant="outline"
              className="h-auto justify-start gap-3 p-4 border-2 rounded-xl transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 bg-transparent group"
            >
              <Link to="/dashboard/products/new">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Add Product</div>
                  <div className="text-xs text-muted-foreground">Create new inventory item</div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto justify-start gap-3 p-4 border-2 rounded-xl transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 bg-transparent group"
            >
              <Link to="/dashboard/orders/new">
                <div className="rounded-lg bg-secondary/20 p-2">
                  <ShoppingCart className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Create Order</div>
                  <div className="text-xs text-muted-foreground">Process customer order</div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto justify-start gap-3 p-4 border-2 rounded-xl transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 bg-transparent group"
            >
              <Link to="/dashboard/wallets">
                <div className="rounded-lg bg-green-500/10 p-2">
                  <Wallet className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Manage Wallets</div>
                  <div className="text-xs text-muted-foreground">View all wallets</div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto justify-start gap-3 p-4 border-2 rounded-xl transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 bg-transparent group"
            >
              <Link to="/dashboard/transactions">
                <div className="rounded-lg bg-orange-500/10 p-2">
                  <ArrowLeftRight className="h-5 w-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">View Transactions</div>
                  <div className="text-xs text-muted-foreground">All wallet activity</div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
