import api from './api';

export interface StockMovement {
  id: number;
  product_id: number;
  product_name: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  stock_before: number;
  stock_after: number;
  reason: string;
  reference: string | null;
  created_by: number;
  created_at: string;
}

export interface StockFilters {
  product_id?: number;
  type?: 'in' | 'out' | 'adjustment';
  from_date?: string;
  to_date?: string;
}

export interface CreateStockMovementData {
  product_id: number;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  reference?: string;
}

const stockService = {
  // Get all stock movements
  async getAll(filters?: StockFilters): Promise<{ success: boolean; data: { movements: StockMovement[]; total: number } }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }
    const response = await api.get(`/stock-movements?${params.toString()}`);
    return response.data;
  },

  // Get single stock movement
  async getById(id: number): Promise<{ success: boolean; data: { movement: StockMovement } }> {
    const response = await api.get(`/stock-movements/${id}`);
    return response.data;
  },

  // Create stock movement
  async create(data: CreateStockMovementData): Promise<{ success: boolean; data: { movement: StockMovement } }> {
    const response = await api.post('/stock-movements', data);
    return response.data;
  },

  // Get stock statistics
  async getStats(): Promise<{ success: boolean; data: { stats: any } }> {
    const response = await api.get('/stock-movements/stats');
    return response.data;
  },

  // Get product stock history
  async getProductHistory(productId: number): Promise<{ success: boolean; data: { product: any; movements: StockMovement[] } }> {
    const response = await api.get(`/stock-movements/product/${productId}/history`);
    return response.data;
  },
};

export default stockService;