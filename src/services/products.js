import api from "./api"

export const productsService = {
  getAll: async () => {
    const response = await api.get("/products")
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  create: async (product) => {
    const response = await api.post("/products", {
      ...product,
      createdAt: new Date().toISOString(),
    })
    return response.data
  },

  update: async (id, product) => {
    const response = await api.patch(`/products/${id}`, product)
    return response.data
  },

  delete: async (id) => {
    await api.delete(`/products/${id}`)
  },
}
