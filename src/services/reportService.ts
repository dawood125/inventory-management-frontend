import api from './api';

const reportService = {
  // Get dashboard statistics
  async getDashboard(): Promise<{ success: boolean; data: any }> {
    const response = await api.get('/reports/dashboard');
    return response.data;
  },

  // Get inventory report
  async getInventory(filters?: { category_id?: number; status?: string }): Promise<{ success: boolean; data: any }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }
    const response = await api.get(`/reports/inventory?${params.toString()}`);
    return response.data;
  },

  // Get sales report
  async getSales(filters?: { status?: string; from_date?: string; to_date?: string }): Promise<{ success: boolean; data: any }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }
    const response = await api.get(`/reports/sales?${params.toString()}`);
    return response.data;
  },

  // Get purchase report
  async getPurchases(filters?: { status?: string; supplier_id?: number; from_date?: string; to_date?: string }): Promise<{ success: boolean; data: any }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }
    const response = await api.get(`/reports/purchases?${params.toString()}`);
    return response.data;
  },

  // Get low stock report
  async getLowStock(): Promise<{ success: boolean; data: any }> {
    const response = await api.get('/reports/low-stock');
    return response.data;
  },

  // Get category report
  async getCategories(): Promise<{ success: boolean; data: any }> {
    const response = await api.get('/reports/categories');
    return response.data;
  },
};

export default reportService;