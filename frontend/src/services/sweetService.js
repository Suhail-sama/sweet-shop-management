import api from './api';

export const sweetService = {
  // Get all sweets
  async getAllSweets() {
    const response = await api.get('/sweets');
    // Backend returns { success: true, count: X, data: [...] }
    return response.data.data || []; // Return the data array, or empty array if undefined
  },

  // Search sweets
  async searchSweets(params) {
    const response = await api.get('/sweets/search', { params });
    return response.data.data || [];
  },

  // Get single sweet
  async getSweet(id) {
    const response = await api.get(`/sweets/${id}`);
    return response.data.data;
  },

  // Add new sweet (Admin only)
  async addSweet(sweetData) {
    const response = await api.post('/sweets', sweetData);
    return response.data.data;
  },

  // Update sweet (Admin only)
  async updateSweet(id, sweetData) {
    const response = await api.put(`/sweets/${id}`, sweetData);
    return response.data.data;
  },

  // Delete sweet (Admin only)
  async deleteSweet(id) {
    const response = await api.delete(`/sweets/${id}`);
    return response.data;
  },

  // Purchase sweet
  async purchaseSweet(id, quantity = 1) {
    const response = await api.post(`/sweets/${id}/purchase`, { quantity });
    return response.data.data;
  },

  // Restock sweet (Admin only)
  async restockSweet(id, quantity) {
    const response = await api.post(`/sweets/${id}/restock`, { quantity });
    return response.data.data;
  },
};