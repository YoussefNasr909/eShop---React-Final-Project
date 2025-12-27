/**
 * ============================================================
 * ORDERS SERVICE - Order Management with Business Logic
 * ============================================================
 * 
 * PURPOSE:
 * Handles all order-related API calls.
 * Contains REAL-WORLD BUSINESS LOGIC for stock management.
 * 
 * IMPORTANT FEATURE - STOCK REDUCTION:
 * When an order is created, this service:
 * 1. Validates that all products have enough stock
 * 2. Reduces the quantity of each product
 * 3. Creates the order record
 * 
 * This demonstrates real e-commerce logic where orders
 * affect inventory levels automatically.
 * ============================================================
 */

import api from "./api"
import { productsService } from "./products"

export const ordersService = {
  /**
   * GET ALL ORDERS
   * Fetches the complete list of orders
   * Used by: Orders.jsx, Overview.jsx
   */
  getAll: async () => {
    const response = await api.get("/orders")
    return response.data
  },

  /**
   * GET ORDER BY ID
   * Fetches a single order with all its details
   * Used by: OrderDetails.jsx
   * @param {string} id - The order ID
   */
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  /**
   * CREATE NEW ORDER - Contains Business Logic!
   * 
   * This is the most important function in the service.
   * It implements REAL-WORLD E-COMMERCE LOGIC:
   * 
   * STEP 1: VALIDATE STOCK
   * - Loop through each item in the order
   * - Check if the product has enough quantity
   * - Throw error if any product is out of stock
   * 
   * STEP 2: REDUCE STOCK
   * - For each item, reduce the product's quantity
   * - Uses productsService.update() to modify inventory
   * 
   * STEP 3: CREATE ORDER
   * - Save the order to the database
   * - Add timestamp for when order was created
   * 
   * @param {object} order - Order data with items array
   * @returns {object} - Created order with ID
   * @throws {Error} - If any product has insufficient stock
   */
  create: async (order) => {
    // ========================================
    // STEP 1: VALIDATE STOCK AVAILABILITY
    // ========================================
    // Before creating the order, we must ensure all products
    // have enough stock. If not, throw an error.
    for (const item of order.items) {
      const product = await productsService.getById(item.productId)

      // Check if requested quantity exceeds available stock
      if (product.quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for ${product.name}. Available: ${product.quantity}`
        )
      }
    }

    // ========================================
    // STEP 2: REDUCE STOCK FOR EACH PRODUCT
    // ========================================
    // Now that we know all items are available,
    // reduce the quantity of each product
    for (const item of order.items) {
      const product = await productsService.getById(item.productId)

      // Calculate new quantity and update the product
      await productsService.update(item.productId, {
        quantity: product.quantity - item.quantity,
      })
    }

    // ========================================
    // STEP 3: CREATE THE ORDER RECORD
    // ========================================
    // Finally, save the order to the database
    const response = await api.post("/orders", {
      ...order,
      createdAt: new Date().toISOString(), // Add timestamp
    })

    return response.data
  },

  /**
   * DELETE ORDER
   * Removes an order from the database
   * NOTE: This does NOT restore the stock. In a real system,
   * you might want a separate "cancel order" function that restores inventory.
   * 
   * @param {string} id - The order ID to delete
   */
  delete: async (id) => {
    await api.delete(`/orders/${id}`)
  },
}
