/**
 * ============================================================
 * PRODUCTS SERVICE - Product CRUD Operations
 * ============================================================
 * 
 * PURPOSE:
 * Handles all API calls related to products.
 * Components call these functions instead of using axios directly.
 * 
 * CRUD OPERATIONS:
 * - CREATE: POST /products
 * - READ:   GET /products (all) or GET /products/:id (one)
 * - UPDATE: PATCH /products/:id
 * - DELETE: DELETE /products/:id
 * 
 * WHY SEPARATE SERVICE:
 * 1. Separation of concerns - components handle UI, services handle data
 * 2. Easy to test - mock the service, not HTTP calls
 * 3. Reusable - multiple components can use the same functions
 * 4. Maintainable - API changes only affect this file
 * ============================================================
 */

import api from "./api"

export const productsService = {
  /**
   * GET ALL PRODUCTS
   * Fetches the complete list of products
   * Used by: Products.jsx, OrderForm.jsx, Overview.jsx
   */
  getAll: async () => {
    const response = await api.get("/products")
    return response.data
  },

  /**
   * GET PRODUCT BY ID
   * Fetches a single product by its ID
   * Used by: ProductForm.jsx (edit mode), OrderForm.jsx
   * @param {string} id - The product ID
   */
  getById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  /**
   * CREATE NEW PRODUCT
   * Creates a new product in the database
   * Automatically adds createdAt timestamp
   * Used by: ProductForm.jsx (create mode)
   * @param {object} product - Product data (sku, name, price, quantity, etc.)
   */
  create: async (product) => {
    const response = await api.post("/products", {
      ...product,
      createdAt: new Date().toISOString(), // Add timestamp
    })
    return response.data
  },

  /**
   * UPDATE EXISTING PRODUCT
   * Updates product fields using PATCH (partial update)
   * Only sends changed fields, not the entire object
   * Used by: ProductForm.jsx (edit mode), orders.js (stock reduction)
   * @param {string} id - The product ID
   * @param {object} product - Fields to update
   */
  update: async (id, product) => {
    const response = await api.patch(`/products/${id}`, product)
    return response.data
  },

  /**
   * DELETE PRODUCT
   * Permanently removes a product from the database
   * Used by: Products.jsx (delete action)
   * @param {string} id - The product ID to delete
   */
  delete: async (id) => {
    await api.delete(`/products/${id}`)
  },
}
