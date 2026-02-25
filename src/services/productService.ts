import api from './api';

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  category_id: number;
  supplier_id: number;
  price: number;
  cost_price: number;
  quantity: number;
  min_stock: number;
  max_stock: number;
  location: string | null;
  image: string | null;
  status: 'active' | 'inactive' | 'discontinued';
  category?: { id: number; name: string };
  supplier?: { id: number; name: string };
  stock_status?: string;
  inventory_value?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  category_id?: number;
  supplier_id?: number;
  status?: string;
  stock_status?: string;
  search?: string;
}

export interface CreateProductData {
  sku: string;
  name: string;
  description?: string;
  category_id: number;
  supplier_id: number;
  price: number;
  cost_price: number;
  quantity?: number;
  min_stock?: number;
  max_stock?: number;
  location?: string;
  image?: string;
  status?: 'active' | 'inactive' | 'discontinued';
}

const productService = {
  // Get all products with optional filters
  async getAll(filters?: ProductFilters): Promise<{ success: boolean; data: { products: Product[]; total: number } }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }
    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  // Get single product
  async getById(id: number): Promise<{ success: boolean; data: { product: Product } }> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create product
  async create(data: CreateProductData): Promise<{ success: boolean; data: { product: Product } }> {
    const response = await api.post('/products', data);
    return response.data;
  },

  // Update product
  async update(id: number, data: Partial<CreateProductData>): Promise<{ success: boolean; data: { product: Product } }> {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  // Delete product
  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Get low stock products
  async getLowStock(): Promise<{ success: boolean; data: { products: Product[]; total: number } }> {
    const response = await api.get('/products/alerts/low-stock');
    return response.data;
  },

  // Get out of stock products
  async getOutOfStock(): Promise<{ success: boolean; data: { products: Product[]; total: number } }> {
    const response = await api.get('/products/alerts/out-of-stock');
    return response.data;
  },
};

export default productService;