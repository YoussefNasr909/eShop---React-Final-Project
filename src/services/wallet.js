import api from "./api"

export const walletService = {
  getAll: async () => {
    const response = await api.get("/wallets")
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/wallets/${id}`)
    return response.data
  },

  // Get the current user's wallet (simulating logged-in user)
  // For now, returns the first wallet in the system
  getWallet: async () => {
    const response = await api.get("/wallets")
    // Return the first wallet or null if none exist
    return response.data.length > 0 ? response.data[0] : null
  },

  createWallet: async (ownerEmail) => {
    const response = await api.post("/wallets", {
      ownerEmail,
      balance: 0,
      createdAt: new Date().toISOString(),
    })
    return response.data
  },

  deposit: async (walletId, amount, reference = "", description = "Deposit") => {
    const wallet = await api.get(`/wallets/${walletId}`)
    const newBalance = wallet.data.balance + amount

    await api.patch(`/wallets/${walletId}`, { balance: newBalance })

    const transaction = await api.post("/walletTransactions", {
      walletId,
      type: "deposit",
      amount,
      reference,
      description,
      createdAt: new Date().toISOString(),
    })

    return { balance: newBalance, transaction: transaction.data }
  },

  withdraw: async (walletId, amount, reference = "", description = "Withdrawal") => {
    const wallet = await api.get(`/wallets/${walletId}`)

    if (wallet.data.balance < amount) {
      throw new Error("Insufficient balance")
    }

    const newBalance = wallet.data.balance - amount

    await api.patch(`/wallets/${walletId}`, { balance: newBalance })

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

  getTransactions: async (walletId) => {
    const response = await api.get(`/walletTransactions?walletId=${walletId}`)
    return response.data
  },

  getAllTransactions: async () => {
    const response = await api.get("/walletTransactions")
    return response.data
  },
}
