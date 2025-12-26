"use client"

import { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { walletService } from "@/services/wallet"
import { formatCurrency, formatDate } from "@/lib/utils"
import PageHeader from "@/components/shared/PageHeader"
import LoadingState from "@/components/shared/LoadingState"
import DataTable from "@/components/shared/DataTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import {
    ArrowLeftRight,
    ArrowUpCircle,
    ArrowDownCircle,
    Search,
    TrendingUp,
    TrendingDown,
    Eye,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"

const ITEMS_PER_PAGE = 10

export default function Transactions() {
    const [transactions, setTransactions] = useState([])
    const [wallets, setWallets] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // Filters
    const [searchQuery, setSearchQuery] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")
    const [walletFilter, setWalletFilter] = useState("all")

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const [txnsData, walletsData] = await Promise.all([walletService.getAllTransactions(), walletService.getAll()])

            // Create a map for wallet emails
            const walletMap = {}
            walletsData.forEach((w) => {
                walletMap[w.id] = w.ownerEmail
            })

            // Enrich transactions with owner email
            const enrichedTxns = txnsData.map((txn) => ({
                ...txn,
                ownerEmail: walletMap[txn.walletId] || "Unknown",
            }))

            setTransactions(enrichedTxns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
            setWallets(walletsData)
        } catch (error) {
            toast.error("Failed to load transactions")
        } finally {
            setIsLoading(false)
        }
    }

    const filteredTransactions = useMemo(() => {
        let filtered = [...transactions]

        // Filter by type
        if (typeFilter !== "all") {
            filtered = filtered.filter((t) => t.type === typeFilter)
        }

        // Filter by wallet
        if (walletFilter !== "all") {
            filtered = filtered.filter((t) => t.walletId === walletFilter)
        }

        // Search by email or reference
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(
                (t) =>
                    t.ownerEmail.toLowerCase().includes(query) ||
                    (t.reference && t.reference.toLowerCase().includes(query)) ||
                    t.description.toLowerCase().includes(query),
            )
        }

        return filtered
    }, [transactions, typeFilter, walletFilter, searchQuery])

    // Pagination
    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
    const paginatedTransactions = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        return filteredTransactions.slice(start, start + ITEMS_PER_PAGE)
    }, [filteredTransactions, currentPage])

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [typeFilter, walletFilter, searchQuery])

    const totalDeposits = useMemo(() => {
        return transactions.filter((t) => t.type === "deposit").reduce((sum, t) => sum + t.amount, 0)
    }, [transactions])

    const totalWithdrawals = useMemo(() => {
        return transactions.filter((t) => t.type === "withdraw").reduce((sum, t) => sum + t.amount, 0)
    }, [transactions])

    const columns = [
        {
            key: "id",
            label: "ID",
            className: "w-[70px]",
            render: (row) => <Badge variant="outline">#{row.id}</Badge>,
        },
        {
            key: "walletId",
            label: "Wallet",
            className: "w-[80px]",
            render: (row) => (
                <Link to={`/dashboard/wallets/${row.walletId}`} className="text-primary hover:underline font-medium">
                    #{row.walletId}
                </Link>
            ),
        },
        {
            key: "ownerEmail",
            label: "Owner Email",
            render: (row) => <span className="font-medium">{row.ownerEmail}</span>,
        },
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
            render: (row) => <span className="text-muted-foreground truncate max-w-[200px] block">{row.description}</span>,
        },
        {
            key: "createdAt",
            label: "Date",
            render: (row) => <span className="text-sm text-muted-foreground">{formatDate(row.createdAt)}</span>,
        },
        {
            key: "actions",
            label: "",
            className: "w-[60px]",
            render: (row) => (
                <Button size="sm" variant="ghost" asChild className="h-8">
                    <Link to={`/dashboard/wallets/${row.walletId}`}>
                        <Eye className="h-4 w-4" />
                    </Link>
                </Button>
            ),
        },
    ]

    if (isLoading) {
        return <LoadingState message="Loading transactions..." />
    }

    return (
        <div className="space-y-6">
            <PageHeader title="Transactions" description="View all wallet transactions across all users" />

            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card className="border-2 card-hover-glow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
                        <div className="rounded-lg bg-primary/10 p-2">
                            <ArrowLeftRight className="h-4 w-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{transactions.length}</div>
                    </CardContent>
                </Card>

                <Card className="border-2 card-hover-glow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Deposits</CardTitle>
                        <div className="rounded-lg bg-green-500/10 p-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{formatCurrency(totalDeposits)}</div>
                    </CardContent>
                </Card>

                <Card className="border-2 card-hover-glow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Withdrawals</CardTitle>
                        <div className="rounded-lg bg-destructive/10 p-2">
                            <TrendingDown className="h-4 w-4 text-destructive" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-destructive">{formatCurrency(totalWithdrawals)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border-2">
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-4">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by email, reference, or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 border-2"
                            />
                        </div>

                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-[150px] border-2">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="deposit">Deposits</SelectItem>
                                <SelectItem value="withdraw">Withdrawals</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={walletFilter} onValueChange={setWalletFilter}>
                            <SelectTrigger className="w-[200px] border-2">
                                <SelectValue placeholder="Wallet" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Wallets</SelectItem>
                                {wallets.map((w) => (
                                    <SelectItem key={w.id} value={w.id}>
                                        #{w.id} - {w.ownerEmail}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Transactions Table */}
            <Card className="border-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ArrowLeftRight className="h-5 w-5 text-primary" />
                        All Transactions
                    </CardTitle>
                    <CardDescription>
                        {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? "s" : ""} found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={paginatedTransactions}
                        emptyIcon={ArrowLeftRight}
                        emptyTitle="No transactions found"
                        emptyDescription={
                            searchQuery || typeFilter !== "all" || walletFilter !== "all"
                                ? "Try adjusting your filters"
                                : "Transactions will appear here once wallets have activity"
                        }
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                                {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length}{" "}
                                transactions
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="gap-1"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </Button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum
                                        if (totalPages <= 5) {
                                            pageNum = i + 1
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i
                                        } else {
                                            pageNum = currentPage - 2 + i
                                        }

                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={currentPage === pageNum ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setCurrentPage(pageNum)}
                                                className="w-8 h-8 p-0"
                                            >
                                                {pageNum}
                                            </Button>
                                        )
                                    })}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="gap-1"
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
