import api from './api';

export interface Category {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

const categoryService = {
  // Get all categories
  async getAll(): Promise<{ success: boolean; data: { categories: Category[] } }> {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get single category
  async getById(id: number): Promise<{ success: boolean; data: { category: Category } }> {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Create category
  async create(data: CreateCategoryData): Promise<{ success: boolean; data: { category: Category } }> {
    const response = await api.post('/categories', data);
    return response.data;
  },

  // Update category
  async update(id: number, data: CreateCategoryData): Promise<{ success: boolean; data: { category: Category } }> {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  // Delete category
  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export default categoryService;