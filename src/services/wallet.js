/**
 * ============================================================
 * WALLET SERVICE - Financial Operations with Balance Protection
 * ============================================================
 * 
 * PURPOSE:
 * Handles all wallet and transaction operations.
 * Contains CRITICAL BUSINESS LOGIC for balance protection.
 * 
 * KEY FEATURES:
 * 1. BALANCE PROTECTION - Cannot withdraw more than available
 * 2. TRANSACTION LOGGING - Every deposit/withdraw creates a record
 * 3. AUDIT TRAIL - Complete history of all financial activities
 * 
 * RESOURCES MANAGED:
 * - Wallets: Store balance and owner information
 * - Transactions: Immutable log of deposits and withdrawals
 * ============================================================
 */

import api from "./api"

export const walletService = {
  /**
   * GET ALL WALLETS
   * Fetches all wallets in the system
   * Used by: Overview.jsx, Transactions.jsx, WalletDetails.jsx
   */
  getAll: async () => {
    const response = await api.get("/wallets")
    return response.data
  },

  /**
   * GET WALLET BY ID
   * Fetches a specific wallet
   * Used by: WalletDetails.jsx
   * @param {string} id - The wallet ID
   */
  getById: async (id) => {
    const response = await api.get(`/wallets/${id}`)
    return response.data
  },

  /**
   * GET CURRENT USER'S WALLET
   * For demo purposes, returns the first wallet in the system.
   * In a real app, this would use authentication to find the user's wallet.
   * Used by: Wallets.jsx
   */
  getWallet: async () => {
    const response = await api.get("/wallets")
    // Return the first wallet or null if none exist
    return response.data.length > 0 ? response.data[0] : null
  },

  /**
   * CREATE NEW WALLET
   * Creates a wallet with zero balance
   * Used by: Wallets.jsx (when no wallet exists)
   * @param {string} ownerEmail - Email of the wallet owner
   */
  createWallet: async (ownerEmail) => {
    const response = await api.post("/wallets", {
      ownerEmail,
      balance: 0, // New wallets start with zero balance
      createdAt: new Date().toISOString(),
    })
    return response.data
  },

  /**
   * DEPOSIT FUNDS INTO WALLET
   * 
   * This function:
   * 1. Gets current wallet balance
   * 2. Adds the deposit amount
   * 3. Updates the wallet
   * 4. Creates a transaction record (AUDIT TRAIL)
   * 
   * @param {string} walletId - The wallet to deposit into
   * @param {number} amount - Amount to deposit (must be > 0)
   * @param {string} reference - Optional reference number
   * @param {string} description - Description of the deposit
   * @returns {object} - New balance and transaction record
   */
  deposit: async (walletId, amount, reference = "", description = "Deposit") => {
    // STEP 1: Get current wallet to read balance
    const wallet = await api.get(`/wallets/${walletId}`)

    // STEP 2: Calculate new balance
    const newBalance = wallet.data.balance + amount

    // STEP 3: Update the wallet with new balance
    await api.patch(`/wallets/${walletId}`, { balance: newBalance })

    // STEP 4: Create transaction record for audit trail
    // This is important for tracking all financial activities
    const transaction = await api.post("/walletTransactions", {
      walletId,
      type: "deposit",
      amount,
      reference,
      description,
      createdAt: new Date().toISOString(),
    })

    // Return both the new balance and the transaction
    return { balance: newBalance, transaction: transaction.data }
  },

  /**
   * WITHDRAW FUNDS FROM WALLET - Contains Balance Protection!
   * 
   * CRITICAL BUSINESS LOGIC:
   * This function PREVENTS withdrawing more than available balance.
   * If user tries to withdraw more than they have, it throws an error.
   * 
   * STEPS:
   * 1. Get current balance
   * 2. VALIDATE: Check if balance >= withdrawal amount
   * 3. If invalid, throw error (stops the withdrawal)
   * 4. If valid, subtract from balance and update wallet
   * 5. Create transaction record for audit
   * 
   * @param {string} walletId - The wallet to withdraw from
   * @param {number} amount - Amount to withdraw
   * @param {string} reference - Optional reference number
   * @param {string} description - Description of the withdrawal
   * @returns {object} - New balance and transaction record
   * @throws {Error} - If amount exceeds available balance
   */
  withdraw: async (walletId, amount, reference = "", description = "Withdrawal") => {
    // STEP 1: Get current wallet balance
    const wallet = await api.get(`/wallets/${walletId}`)

    // ========================================
    // STEP 2: BALANCE PROTECTION (Critical!)
    // ========================================
    // This is the key business logic - prevent negative balance
    if (wallet.data.balance < amount) {
      throw new Error("Insufficient balance")
    }

    // STEP 3: Calculate new balance (only reached if validation passes)
    const newBalance = wallet.data.balance - amount

    // STEP 4: Update the wallet
    await api.patch(`/wallets/${walletId}`, { balance: newBalance })

    // STEP 5: Create transaction record for audit trail
    const transaction = await api.post("/walletTransactions", {
      walletId,
      type: "withdraw",
      amount,
      reference,
      description,
      createdAt: new Date().toISOString(),
    })

    return { balance: newBalance, transaction: transaction.data }
  },

  /**
   * GET TRANSACTIONS FOR A SPECIFIC WALLET
   * Fetches all transactions belonging to one wallet
   * Used by: WalletDetails.jsx, Wallets.jsx
   * @param {string} walletId - The wallet ID to get transactions for
   */
  getTransactions: async (walletId) => {
    // Uses JSON Server query parameter to filter by walletId
    const response = await api.get(`/walletTransactions?walletId=${walletId}`)
    return response.data
  },

  /**
   * GET ALL TRANSACTIONS (GLOBAL)
   * Fetches transactions across ALL wallets
   * Used by: Transactions.jsx (admin view), Overview.jsx
   * This gives admins visibility into all financial activity
   */
  getAllTransactions: async () => {
    const response = await api.get("/walletTransactions")
    return response.data
  },
}
