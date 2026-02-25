import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: 'admin' | 'manager' | 'staff';
  avatar: string | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    token_type: string;
  };
}

const authService = {
  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/register', data);
    return response.data;
  },

  // Login user
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/login', data);
    return response.data;
  },

  // Logout user
  async logout(): Promise<void> {
    await api.post('/logout');
  },

  // Get current user
  async getUser(): Promise<{ success: boolean; data: { user: User } }> {
    const response = await api.get('/user');
    return response.data;
  },

  // Update profile
  async updateProfile(data: Partial<User>): Promise<{ success: boolean; data: { user: User } }> {
    const response = await api.put('/user/update', data);
    return response.data;
  },

  // Change password
  async changePassword(data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }): Promise<{ success: boolean; message: string }> {
    const response = await api.put('/user/change-password', data);
    return response.data;
  },
};

export default authService;