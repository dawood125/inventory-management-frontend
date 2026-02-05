// Core Types for Inventory Management System

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  costPrice: number;
  quantity: number;
  minStock: number;
  maxStock: number;
  supplier: string;
  location: string;
  image: string;
  status: 'active' | 'inactive' | 'discontinued';
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: 'active' | 'inactive';
  rating: number;
  totalOrders: number;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  type: 'purchase' | 'sale';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
  supplier?: string;
  customer?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  reference: string;
  createdAt: string;
  createdBy: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  lowStockItems: number;
  totalValue: number;
  pendingOrders: number;
  monthlyRevenue: number;
  monthlyCost: number;
  profit: number;
}

export interface Alert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'expiry' | 'order';
  message: string;
  productId?: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  avatar: string;
}
