"use client"

import { useState, useEffect } from "react"
import { walletService } from "@/services/wallet"
import { formatCurrency, formatDate } from "@/lib/utils"
import PageHeader from "@/components/shared/PageHeader"
import LoadingState from "@/components/shared/LoadingState"
import DataTable from "@/components/shared/DataTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { WalletIcon, ArrowUpCircle, ArrowDownCircle, Plus, TrendingUp, TrendingDown } from "lucide-react"

export default function Wallet() {
  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isDepositing, setIsDepositing] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const [ownerEmail, setOwnerEmail] = useState("")
  const [depositAmount, setDepositAmount] = useState("")
  const [depositDescription, setDepositDescription] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawDescription, setWithdrawDescription] = useState("")

  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchWalletData()
  }, [])

  const fetchWalletData = async () => {
    try {
      setIsLoading(true)
      const walletData = await walletService.getWallet()
      setWallet(walletData)

      if (walletData) {
        const txns = await walletService.getTransactions(walletData.id)
        setTransactions(txns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
      }
    } catch (error) {
      toast.error("Failed to load wallet data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateWallet = async (e) => {
    e.preventDefault()

    if (!ownerEmail.trim()) {
      setErrors({ ownerEmail: "Email is required" })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(ownerEmail)) {
      setErrors({ ownerEmail: "Please enter a valid email" })
      return
    }

    try {
      setIsCreating(true)
      const newWallet = await walletService.createWallet(ownerEmail.trim())
      setWallet(newWallet)
      setOwnerEmail("")
      toast.success("Wallet created successfully")
    } catch (error) {
      toast.error("Failed to create wallet")
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeposit = async (e) => {
    e.preventDefault()

    const amount = Number.parseFloat(depositAmount)
    if (isNaN(amount) || amount <= 0) {
      setErrors({ deposit: "Amount must be greater than 0" })
      return
    }

    try {
      setIsDepositing(true)
      const result = await walletService.deposit(wallet.id, amount, depositDescription.trim() || "Deposit")

      setWallet((prev) => ({ ...prev, balance: result.balance }))
      setTransactions((prev) => [result.transaction, ...prev])
      setDepositAmount("")
      setDepositDescription("")
      setErrors({})
      toast.success(`Successfully deposited ${formatCurrency(amount)}`)
    } catch (error) {
      toast.error("Failed to deposit")
    } finally {
      setIsDepositing(false)
    }
  }

  const handleWithdraw = async (e) => {
    e.preventDefault()

    const amount = Number.parseFloat(withdrawAmount)
    if (isNaN(amount) || amount <= 0) {
      setErrors({ withdraw: "Amount must be greater than 0" })
      return
    }

    if (amount > wallet.balance) {
      setErrors({ withdraw: "Insufficient balance" })
      return
    }

    try {
      setIsWithdrawing(true)
      const result = await walletService.withdraw(wallet.id, amount, withdrawDescription.trim() || "Withdrawal")

      setWallet((prev) => ({ ...prev, balance: result.balance }))
      setTransactions((prev) => [result.transaction, ...prev])
      setWithdrawAmount("")
      setWithdrawDescription("")
      setErrors({})
      toast.success(`Successfully withdrew ${formatCurrency(amount)}`)
    } catch (error) {
      toast.error(error.message || "Failed to withdraw")
    } finally {
      setIsWithdrawing(false)
    }
  }

  const totalDeposits = transactions.filter((t) => t.type === "deposit").reduce((sum, t) => sum + t.amount, 0)
  const totalWithdrawals = transactions.filter((t) => t.type === "withdraw").reduce((sum, t) => sum + t.amount, 0)

  const transactionColumns = [
    {
      key: "type",
      label: "Type",
      className: "w-[120px]",
      render: (row) => (
        <Badge variant={row.type === "deposit" ? "default" : "destructive"} className="gap-1">
          {row.type === "deposit" ? <ArrowUpCircle className="h-3 w-3" /> : <ArrowDownCircle className="h-3 w-3" />}
          {row.type}
        </Badge>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      className: "text-right",
      cellClassName: "text-right",
      render: (row) => (
        <span className={`font-bold ${row.type === "deposit" ? "text-green-600" : "text-destructive"}`}>
          {row.type === "deposit" ? "+" : "-"}
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (row) => <span className="text-muted-foreground">{row.description}</span>,
    },
    {
      key: "createdAt",
      label: "Date",
      render: (row) => <span className="text-sm text-muted-foreground">{formatDate(row.createdAt)}</span>,
    },
  ]

  if (isLoading) {
    return <LoadingState message="Loading wallet..." />
  }

  // No wallet - show create form
  if (!wallet) {
    return (
      <div className="space-y-6">
        <PageHeader title="Wallet" description="Create a wallet to manage your finances" />

        <Card className="max-w-md border-2 card-hover-glow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3">
                <WalletIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Create Wallet</CardTitle>
                <CardDescription>Enter your email to create a new wallet</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateWallet} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ownerEmail" className="text-sm font-medium">
                  Owner Email *
                </Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  placeholder="admin@eshop.com"
                  value={ownerEmail}
                  onChange={(e) => {
                    setOwnerEmail(e.target.value)
                    if (errors.ownerEmail) setErrors({})
                  }}
                  className={`h-10 border-2 ${errors.ownerEmail ? "border-destructive" : ""}`}
                />
                {errors.ownerEmail && <p className="text-sm text-destructive">{errors.ownerEmail}</p>}
              </div>
              <Button
                type="submit"
                disabled={isCreating}
                className="w-full gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                {isCreating ? "Creating..." : "Create Wallet"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Wallet" description="Manage your wallet balance and view transactions" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-3 border-2 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
          <CardContent className="flex flex-wrap items-center gap-8 pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-primary/10 p-4">
                <WalletIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Current Balance</p>
                <p className="text-4xl font-bold">{formatCurrency(wallet.balance)}</p>
              </div>
            </div>
            <Separator orientation="vertical" className="h-16 hidden md:block" />
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Deposits</p>
                  <p className="font-semibold text-green-600">{formatCurrency(totalDeposits)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Withdrawals</p>
                  <p className="font-semibold text-destructive">{formatCurrency(totalWithdrawals)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 card-hover-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="rounded-lg bg-green-500/10 p-2">
                <ArrowUpCircle className="h-5 w-5 text-green-600" />
              </div>
              Deposit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="depositAmount" className="text-sm font-medium">
                  Amount *
                </Label>
                <Input
                  id="depositAmount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={(e) => {
                    setDepositAmount(e.target.value)
                    if (errors.deposit) setErrors((prev) => ({ ...prev, deposit: "" }))
                  }}
                  className={`h-10 border-2 ${errors.deposit ? "border-destructive" : ""}`}
                />
                {errors.deposit && <p className="text-sm text-destructive">{errors.deposit}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="depositDescription" className="text-sm font-medium">
                  Description
                </Label>
                <Input
                  id="depositDescription"
                  placeholder="e.g., Sales revenue"
                  value={depositDescription}
                  onChange={(e) => setDepositDescription(e.target.value)}
                  className="h-10 border-2"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                disabled={isDepositing}
              >
                <ArrowUpCircle className="h-4 w-4" />
                {isDepositing ? "Processing..." : "Deposit"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-2 card-hover-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="rounded-lg bg-destructive/10 p-2">
                <ArrowDownCircle className="h-5 w-5 text-destructive" />
              </div>
              Withdraw
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdrawAmount" className="text-sm font-medium">
                  Amount *
                </Label>
                <Input
                  id="withdrawAmount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={wallet.balance}
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => {
                    setWithdrawAmount(e.target.value)
                    if (errors.withdraw) setErrors((prev) => ({ ...prev, withdraw: "" }))
                  }}
                  className={`h-10 border-2 ${errors.withdraw ? "border-destructive" : ""}`}
                />
                {errors.withdraw && <p className="text-sm text-destructive">{errors.withdraw}</p>}
                <p className="text-xs text-muted-foreground">Available: {formatCurrency(wallet.balance)}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="withdrawDescription" className="text-sm font-medium">
                  Description
                </Label>
                <Input
                  id="withdrawDescription"
                  placeholder="e.g., Supplier payment"
                  value={withdrawDescription}
                  onChange={(e) => setWithdrawDescription(e.target.value)}
                  className="h-10 border-2"
                />
              </div>
              <Button
                type="submit"
                variant="destructive"
                className="w-full gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                disabled={isWithdrawing}
              >
                <ArrowDownCircle className="h-4 w-4" />
                {isWithdrawing ? "Processing..." : "Withdraw"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-2 card-hover-glow">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Owner Email</span>
              <span className="font-medium text-sm">{wallet.ownerEmail}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Transactions</span>
              <Badge variant="secondary">{transactions.length}</Badge>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Wallet Created</span>
              <span className="text-sm text-muted-foreground">{formatDate(wallet.createdAt)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="lg:col-span-3 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WalletIcon className="h-5 w-5 text-primary" />
              Transaction History
            </CardTitle>
            <CardDescription>All your deposits and withdrawals</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={transactionColumns}
              data={transactions}
              emptyIcon={WalletIcon}
              emptyTitle="No transactions yet"
              emptyDescription="Deposit or withdraw to see your transaction history."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
