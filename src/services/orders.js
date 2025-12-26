import api from "./api"
import { productsService } from "./products"

export const ordersService = {
  getAll: async () => {
    const response = await api.get("/orders")
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  create: async (order) => {
    // Check stock availability and reduce quantities
    for (const item of order.items) {
      const product = await productsService.getById(item.productId)
      if (product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.quantity}`)
      }
    }

    // Reduce stock for each product
    for (const item of order.items) {
      const product = await productsService.getById(item.productId)
      await productsService.update(item.productId, {
        quantity: product.quantity - item.quantity,
      })
    }

    // Create the order
    const response = await api.post("/orders", {
      ...order,
      createdAt: new Date().toISOString(),
    })
    return response.data
  },

  delete: async (id) => {
    await api.delete(`/orders/${id}`)
  },
}
