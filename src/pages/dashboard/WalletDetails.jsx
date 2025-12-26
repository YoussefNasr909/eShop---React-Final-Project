"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import {
    Wallet,
    ArrowUpCircle,
    ArrowDownCircle,
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    Calendar,
    Mail,
} from "lucide-react"

export default function WalletDetails() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [wallet, setWallet] = useState(null)
    const [transactions, setTransactions] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // Deposit dialog
    const [isDepositOpen, setIsDepositOpen] = useState(false)
    const [isDepositing, setIsDepositing] = useState(false)
    const [depositAmount, setDepositAmount] = useState("")
    const [depositReference, setDepositReference] = useState("")
    const [depositDescription, setDepositDescription] = useState("")
    const [depositError, setDepositError] = useState("")

    // Withdraw dialog
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
    const [isWithdrawing, setIsWithdrawing] = useState(false)
    const [withdrawAmount, setWithdrawAmount] = useState("")
    const [withdrawReference, setWithdrawReference] = useState("")
    const [withdrawDescription, setWithdrawDescription] = useState("")
    const [withdrawError, setWithdrawError] = useState("")

    useEffect(() => {
        fetchWalletData()
    }, [id])

    const fetchWalletData = async () => {
        try {
            setIsLoading(true)
            const walletData = await walletService.getById(id)
            setWallet(walletData)

            const txns = await walletService.getTransactions(id)
            setTransactions(txns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
        } catch (error) {
            toast.error("Failed to load wallet data")
            navigate("/dashboard/wallets")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeposit = async (e) => {
        e.preventDefault()
        setDepositError("")

        const amount = Number.parseFloat(depositAmount)
        if (isNaN(amount) || amount <= 0) {
            setDepositError("Amount must be greater than 0")
            return
        }

        try {
            setIsDepositing(true)
            const result = await walletService.deposit(
                wallet.id,
                amount,
                depositReference.trim(),
                depositDescription.trim() || "Deposit",
            )

            setWallet((prev) => ({ ...prev, balance: result.balance }))
            setTransactions((prev) => [result.transaction, ...prev])
            setDepositAmount("")
            setDepositReference("")
            setDepositDescription("")
            setIsDepositOpen(false)
            toast.success(`Successfully deposited ${formatCurrency(amount)}`)
        } catch (error) {
            toast.error("Failed to deposit")
        } finally {
            setIsDepositing(false)
        }
    }

    const handleWithdraw = async (e) => {
        e.preventDefault()
        setWithdrawError("")

        const amount = Number.parseFloat(withdrawAmount)
        if (isNaN(amount) || amount <= 0) {
            setWithdrawError("Amount must be greater than 0")
            return
        }

        if (amount > wallet.balance) {
            setWithdrawError("Insufficient balance")
            return
        }

        try {
            setIsWithdrawing(true)
            const result = await walletService.withdraw(
                wallet.id,
                amount,
                withdrawReference.trim(),
                withdrawDescription.trim() || "Withdrawal",
            )

            setWallet((prev) => ({ ...prev, balance: result.balance }))
            setTransactions((prev) => [result.transaction, ...prev])
            setWithdrawAmount("")
            setWithdrawReference("")
            setWithdrawDescription("")
            setIsWithdrawOpen(false)
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
            key: "reference",
            label: "Reference",
            render: (row) => <span className="text-sm text-muted-foreground">{row.reference || "-"}</span>,
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
        return <LoadingState message="Loading wallet details..." />
    }

    if (!wallet) {
        return null
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={`Wallet #${wallet.id}`}
                description={wallet.ownerEmail}
                action={
                    <Button variant="outline" asChild className="gap-2 bg-transparent">
                        <Link to="/dashboard/wallets">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Wallets
                        </Link>
                    </Button>
                }
            />

            {/* Wallet Summary */}
            <div className="grid gap-6 lg:grid-cols-4">
                <Card className="lg:col-span-2 border-2 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
                    <CardContent className="flex flex-wrap items-center gap-8 pt-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-2xl bg-primary/10 p-4">
                                <Wallet className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Current Balance</p>
                                <p className="text-4xl font-bold">{formatCurrency(wallet.balance)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 card-hover-glow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            Total Deposits
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(totalDeposits)}</p>
                    </CardContent>
                </Card>

                <Card className="border-2 card-hover-glow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-destructive" />
                            Total Withdrawals
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-destructive">{formatCurrency(totalWithdrawals)}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Wallet Info & Actions */}
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle>Wallet Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Owner Email</p>
                                <p className="font-medium">{wallet.ownerEmail}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Created</p>
                                <p className="font-medium">{formatDate(wallet.createdAt)}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-center gap-3">
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Total Transactions</p>
                                <Badge variant="secondary">{transactions.length}</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 card-hover-glow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ArrowUpCircle className="h-5 w-5 text-green-600" />
                            Deposit
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => {
                                setDepositAmount("")
                                setDepositReference("")
                                setDepositDescription("")
                                setDepositError("")
                                setIsDepositOpen(true)
                            }}
                            className="w-full gap-2 bg-green-600 hover:bg-green-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <ArrowUpCircle className="h-4 w-4" />
                            Make Deposit
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-2 card-hover-glow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ArrowDownCircle className="h-5 w-5 text-destructive" />
                            Withdraw
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => {
                                setWithdrawAmount("")
                                setWithdrawReference("")
                                setWithdrawDescription("")
                                setWithdrawError("")
                                setIsWithdrawOpen(true)
                            }}
                            variant="destructive"
                            className="w-full gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <ArrowDownCircle className="h-4 w-4" />
                            Make Withdrawal
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                            Available: {formatCurrency(wallet.balance)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions Table */}
            <Card className="border-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-primary" />
                        Transaction History
                    </CardTitle>
                    <CardDescription>All deposits and withdrawals for this wallet</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={transactionColumns}
                        data={transactions}
                        emptyIcon={Wallet}
                        emptyTitle="No transactions yet"
                        emptyDescription="Make a deposit or withdrawal to see transaction history."
                    />
                </CardContent>
            </Card>

            {/* Deposit Dialog */}
            <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ArrowUpCircle className="h-5 w-5 text-green-600" />
                            Deposit to Wallet
                        </DialogTitle>
                        <DialogDescription>Current balance: {formatCurrency(wallet.balance)}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleDeposit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="detailDepositAmount">Amount *</Label>
                                <Input
                                    id="detailDepositAmount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    placeholder="0.00"
                                    value={depositAmount}
                                    onChange={(e) => {
                                        setDepositAmount(e.target.value)
                                        setDepositError("")
                                    }}
                                    className={`border-2 ${depositError ? "border-destructive" : ""}`}
                                />
                                {depositError && <p className="text-sm text-destructive">{depositError}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="detailDepositReference">Reference</Label>
                                <Input
                                    id="detailDepositReference"
                                    placeholder="e.g., TXN-12345"
                                    value={depositReference}
                                    onChange={(e) => setDepositReference(e.target.value)}
                                    className="border-2"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="detailDepositDescription">Description</Label>
                                <Input
                                    id="detailDepositDescription"
                                    placeholder="e.g., Sales revenue"
                                    value={depositDescription}
                                    onChange={(e) => setDepositDescription(e.target.value)}
                                    className="border-2"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDepositOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isDepositing} className="gap-2 bg-green-600 hover:bg-green-700">
                                <ArrowUpCircle className="h-4 w-4" />
                                {isDepositing ? "Processing..." : "Deposit"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Withdraw Dialog */}
            <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ArrowDownCircle className="h-5 w-5 text-destructive" />
                            Withdraw from Wallet
                        </DialogTitle>
                        <DialogDescription>Available balance: {formatCurrency(wallet.balance)}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleWithdraw}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="detailWithdrawAmount">Amount *</Label>
                                <Input
                                    id="detailWithdrawAmount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    max={wallet.balance}
                                    placeholder="0.00"
                                    value={withdrawAmount}
                                    onChange={(e) => {
                                        setWithdrawAmount(e.target.value)
                                        setWithdrawError("")
                                    }}
                                    className={`border-2 ${withdrawError ? "border-destructive" : ""}`}
                                />
                                {withdrawError && <p className="text-sm text-destructive">{withdrawError}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="detailWithdrawReference">Reference</Label>
                                <Input
                                    id="detailWithdrawReference"
                                    placeholder="e.g., PAY-67890"
                                    value={withdrawReference}
                                    onChange={(e) => setWithdrawReference(e.target.value)}
                                    className="border-2"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="detailWithdrawDescription">Description</Label>
                                <Input
                                    id="detailWithdrawDescription"
                                    placeholder="e.g., Supplier payment"
                                    value={withdrawDescription}
                                    onChange={(e) => setWithdrawDescription(e.target.value)}
                                    className="border-2"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsWithdrawOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="destructive" disabled={isWithdrawing} className="gap-2">
                                <ArrowDownCircle className="h-4 w-4" />
                                {isWithdrawing ? "Processing..." : "Withdraw"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
