import api from './api';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: number;
  order_number: string;
  type: 'purchase' | 'sale';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total_amount: number;
  supplier_id: number | null;
  customer_name: string | null;
  notes: string | null;
  items: OrderItem[];
  supplier?: { id: number; name: string };
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface OrderFilters {
  type?: 'purchase' | 'sale';
  status?: 'pending' | 'processing' | 'completed' | 'cancelled';
  search?: string;
  from_date?: string;
  to_date?: string;
}

export interface CreateOrderData {
  type: 'purchase' | 'sale';
  supplier_id?: number;
  customer_name?: string;
  notes?: string;
  items: {
    product_id: number;
    quantity: number;
  }[];
}

const orderService = {
  // Get all orders
  async getAll(filters?: OrderFilters): Promise<{ success: boolean; data: { orders: Order[]; total: number } }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }
    const response = await api.get(`/orders?${params.toString()}`);
    return response.data;
  },

  // Get single order
  async getById(id: number): Promise<{ success: boolean; data: { order: Order } }> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Create order
  async create(data: CreateOrderData): Promise<{ success: boolean; data: { order: Order } }> {
    const response = await api.post('/orders', data);
    return response.data;
  },

  // Update order status
  async updateStatus(id: number, status: Order['status']): Promise<{ success: boolean; data: { order: Order } }> {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Delete order
  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },

  // Get order statistics
  async getStats(): Promise<{ success: boolean; data: { stats: any } }> {
    const response = await api.get('/orders/stats');
    return response.data;
  },
};

export default orderService;