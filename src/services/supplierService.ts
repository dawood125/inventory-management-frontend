import api from './api';

export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: 'active' | 'inactive';
  rating: number;
  total_orders: number;
  created_at: string;
  updated_at: string;
}

export interface SupplierFilters {
  status?: 'active' | 'inactive';
  search?: string;
}

export interface CreateSupplierData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status?: 'active' | 'inactive';
  rating?: number;
}

const supplierService = {
  // Get all suppliers
  async getAll(filters?: SupplierFilters): Promise<{ success: boolean; data: { suppliers: Supplier[]; total: number } }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }
    const response = await api.get(`/suppliers?${params.toString()}`);
    return response.data;
  },

  // Get single supplier
  async getById(id: number): Promise<{ success: boolean; data: { supplier: Supplier } }> {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  },

  // Create supplier
  async create(data: CreateSupplierData): Promise<{ success: boolean; data: { supplier: Supplier } }> {
    const response = await api.post('/suppliers', data);
    return response.data;
  },

  // Update supplier
  async update(id: number, data: Partial<CreateSupplierData>): Promise<{ success: boolean; data: { supplier: Supplier } }> {
    const response = await api.put(`/suppliers/${id}`, data);
    return response.data;
  },

  // Update supplier status
  async updateStatus(id: number, status: 'active' | 'inactive'): Promise<{ success: boolean; data: { supplier: Supplier } }> {
    const response = await api.patch(`/suppliers/${id}/status`, { status });
    return response.data;
  },

  // Delete supplier
  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
  },
};

export default supplierService;