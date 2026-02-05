import { Product, Supplier, Order, StockMovement, Category, Alert } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Electronics', description: 'Electronic devices and accessories', productCount: 45 },
  { id: '2', name: 'Clothing', description: 'Apparel and fashion items', productCount: 78 },
  { id: '3', name: 'Food & Beverages', description: 'Consumable food products', productCount: 120 },
  { id: '4', name: 'Furniture', description: 'Home and office furniture', productCount: 34 },
  { id: '5', name: 'Sports', description: 'Sports equipment and accessories', productCount: 56 },
  { id: '6', name: 'Beauty', description: 'Cosmetics and beauty products', productCount: 89 },
];

export const products: Product[] = [
  {
    id: '1',
    sku: 'ELEC-001',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-canceling wireless headphones with 30-hour battery life',
    category: 'Electronics',
    price: 149.99,
    costPrice: 75.00,
    quantity: 45,
    minStock: 10,
    maxStock: 100,
    supplier: 'TechSupply Co',
    location: 'Warehouse A - Shelf 12',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-03-10'
  },
  {
    id: '2',
    sku: 'ELEC-002',
    name: 'Smart Watch Pro',
    description: 'Advanced fitness tracking smartwatch with GPS and heart rate monitor',
    category: 'Electronics',
    price: 299.99,
    costPrice: 150.00,
    quantity: 8,
    minStock: 15,
    maxStock: 80,
    supplier: 'TechSupply Co',
    location: 'Warehouse A - Shelf 14',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
    status: 'active',
    createdAt: '2024-01-20',
    updatedAt: '2024-03-12'
  },
  {
    id: '3',
    sku: 'CLTH-001',
    name: 'Premium Cotton T-Shirt',
    description: '100% organic cotton t-shirt, available in multiple colors',
    category: 'Clothing',
    price: 29.99,
    costPrice: 12.00,
    quantity: 150,
    minStock: 50,
    maxStock: 300,
    supplier: 'Fashion Forward Ltd',
    location: 'Warehouse B - Section 5',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200',
    status: 'active',
    createdAt: '2024-02-01',
    updatedAt: '2024-03-08'
  },
  {
    id: '4',
    sku: 'FURN-001',
    name: 'Ergonomic Office Chair',
    description: 'Adjustable lumbar support office chair with breathable mesh',
    category: 'Furniture',
    price: 349.99,
    costPrice: 180.00,
    quantity: 3,
    minStock: 10,
    maxStock: 50,
    supplier: 'Office Essentials Inc',
    location: 'Warehouse C - Area 2',
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=200',
    status: 'active',
    createdAt: '2024-01-10',
    updatedAt: '2024-03-05'
  },
  {
    id: '5',
    sku: 'SPRT-001',
    name: 'Professional Yoga Mat',
    description: 'Non-slip eco-friendly yoga mat with alignment lines',
    category: 'Sports',
    price: 49.99,
    costPrice: 20.00,
    quantity: 75,
    minStock: 20,
    maxStock: 150,
    supplier: 'FitGear Pro',
    location: 'Warehouse B - Section 8',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=200',
    status: 'active',
    createdAt: '2024-02-15',
    updatedAt: '2024-03-11'
  },
  {
    id: '6',
    sku: 'BEAU-001',
    name: 'Organic Face Serum',
    description: 'Anti-aging vitamin C serum with hyaluronic acid',
    category: 'Beauty',
    price: 59.99,
    costPrice: 25.00,
    quantity: 0,
    minStock: 30,
    maxStock: 200,
    supplier: 'Natural Beauty Co',
    location: 'Warehouse A - Shelf 3',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200',
    status: 'active',
    createdAt: '2024-01-25',
    updatedAt: '2024-03-14'
  },
  {
    id: '7',
    sku: 'ELEC-003',
    name: '4K Webcam',
    description: 'Ultra HD webcam with auto-focus and noise-canceling mic',
    category: 'Electronics',
    price: 129.99,
    costPrice: 55.00,
    quantity: 22,
    minStock: 15,
    maxStock: 100,
    supplier: 'TechSupply Co',
    location: 'Warehouse A - Shelf 16',
    image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=200',
    status: 'active',
    createdAt: '2024-02-10',
    updatedAt: '2024-03-09'
  },
  {
    id: '8',
    sku: 'FOOD-001',
    name: 'Organic Coffee Beans',
    description: 'Premium arabica coffee beans, medium roast, 1kg bag',
    category: 'Food & Beverages',
    price: 24.99,
    costPrice: 12.00,
    quantity: 200,
    minStock: 50,
    maxStock: 500,
    supplier: 'Global Foods Ltd',
    location: 'Warehouse D - Cold Storage',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200',
    status: 'active',
    createdAt: '2024-01-05',
    updatedAt: '2024-03-13'
  }
];

export const suppliers: Supplier[] = [
  {
    id: '1',
    name: 'TechSupply Co',
    email: 'orders@techsupply.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Boulevard',
    city: 'San Francisco',
    country: 'USA',
    status: 'active',
    rating: 4.8,
    totalOrders: 156,
    createdAt: '2023-01-15'
  },
  {
    id: '2',
    name: 'Fashion Forward Ltd',
    email: 'supply@fashionforward.com',
    phone: '+1 (555) 234-5678',
    address: '456 Fashion Avenue',
    city: 'New York',
    country: 'USA',
    status: 'active',
    rating: 4.5,
    totalOrders: 89,
    createdAt: '2023-03-20'
  },
  {
    id: '3',
    name: 'Office Essentials Inc',
    email: 'orders@officeessentials.com',
    phone: '+1 (555) 345-6789',
    address: '789 Business Park',
    city: 'Chicago',
    country: 'USA',
    status: 'active',
    rating: 4.2,
    totalOrders: 67,
    createdAt: '2023-05-10'
  },
  {
    id: '4',
    name: 'FitGear Pro',
    email: 'wholesale@fitgearpro.com',
    phone: '+1 (555) 456-7890',
    address: '321 Sports Center Drive',
    city: 'Los Angeles',
    country: 'USA',
    status: 'active',
    rating: 4.6,
    totalOrders: 45,
    createdAt: '2023-06-15'
  },
  {
    id: '5',
    name: 'Natural Beauty Co',
    email: 'orders@naturalbeauty.com',
    phone: '+1 (555) 567-8901',
    address: '567 Wellness Way',
    city: 'Miami',
    country: 'USA',
    status: 'active',
    rating: 4.9,
    totalOrders: 112,
    createdAt: '2023-02-28'
  },
  {
    id: '6',
    name: 'Global Foods Ltd',
    email: 'supply@globalfoods.com',
    phone: '+1 (555) 678-9012',
    address: '890 Harvest Road',
    city: 'Seattle',
    country: 'USA',
    status: 'inactive',
    rating: 3.8,
    totalOrders: 34,
    createdAt: '2023-07-20'
  }
];

export const orders: Order[] = [
  {
    id: '1',
    orderNumber: 'PO-2024-001',
    type: 'purchase',
    status: 'completed',
    items: [
      { productId: '1', productName: 'Wireless Bluetooth Headphones', quantity: 50, price: 75.00, total: 3750.00 },
      { productId: '2', productName: 'Smart Watch Pro', quantity: 30, price: 150.00, total: 4500.00 }
    ],
    totalAmount: 8250.00,
    supplier: 'TechSupply Co',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-05'
  },
  {
    id: '2',
    orderNumber: 'SO-2024-001',
    type: 'sale',
    status: 'completed',
    items: [
      { productId: '1', productName: 'Wireless Bluetooth Headphones', quantity: 5, price: 149.99, total: 749.95 },
      { productId: '7', productName: '4K Webcam', quantity: 3, price: 129.99, total: 389.97 }
    ],
    totalAmount: 1139.92,
    customer: 'ABC Corporation',
    createdAt: '2024-03-08',
    updatedAt: '2024-03-08'
  },
  {
    id: '3',
    orderNumber: 'PO-2024-002',
    type: 'purchase',
    status: 'pending',
    items: [
      { productId: '4', productName: 'Ergonomic Office Chair', quantity: 20, price: 180.00, total: 3600.00 }
    ],
    totalAmount: 3600.00,
    supplier: 'Office Essentials Inc',
    createdAt: '2024-03-12',
    updatedAt: '2024-03-12'
  },
  {
    id: '4',
    orderNumber: 'SO-2024-002',
    type: 'sale',
    status: 'processing',
    items: [
      { productId: '3', productName: 'Premium Cotton T-Shirt', quantity: 25, price: 29.99, total: 749.75 },
      { productId: '5', productName: 'Professional Yoga Mat', quantity: 10, price: 49.99, total: 499.90 }
    ],
    totalAmount: 1249.65,
    customer: 'XYZ Retail Store',
    createdAt: '2024-03-14',
    updatedAt: '2024-03-14'
  },
  {
    id: '5',
    orderNumber: 'PO-2024-003',
    type: 'purchase',
    status: 'pending',
    items: [
      { productId: '6', productName: 'Organic Face Serum', quantity: 100, price: 25.00, total: 2500.00 }
    ],
    totalAmount: 2500.00,
    supplier: 'Natural Beauty Co',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15'
  }
];

export const stockMovements: StockMovement[] = [
  { id: '1', productId: '1', productName: 'Wireless Bluetooth Headphones', type: 'in', quantity: 50, reason: 'Purchase Order', reference: 'PO-2024-001', createdAt: '2024-03-05', createdBy: 'John Admin' },
  { id: '2', productId: '1', productName: 'Wireless Bluetooth Headphones', type: 'out', quantity: 5, reason: 'Sales Order', reference: 'SO-2024-001', createdAt: '2024-03-08', createdBy: 'Jane Manager' },
  { id: '3', productId: '2', productName: 'Smart Watch Pro', type: 'in', quantity: 30, reason: 'Purchase Order', reference: 'PO-2024-001', createdAt: '2024-03-05', createdBy: 'John Admin' },
  { id: '4', productId: '7', productName: '4K Webcam', type: 'out', quantity: 3, reason: 'Sales Order', reference: 'SO-2024-001', createdAt: '2024-03-08', createdBy: 'Jane Manager' },
  { id: '5', productId: '3', productName: 'Premium Cotton T-Shirt', type: 'adjustment', quantity: -10, reason: 'Inventory Audit', reference: 'ADJ-2024-001', createdAt: '2024-03-10', createdBy: 'John Admin' },
  { id: '6', productId: '8', productName: 'Organic Coffee Beans', type: 'in', quantity: 100, reason: 'Regular Restock', reference: 'PO-2024-000', createdAt: '2024-03-01', createdBy: 'System' },
];

export const alerts: Alert[] = [
  { id: '1', type: 'low_stock', message: 'Smart Watch Pro is running low (8 units remaining)', productId: '2', severity: 'high', createdAt: '2024-03-14', read: false },
  { id: '2', type: 'out_of_stock', message: 'Organic Face Serum is out of stock!', productId: '6', severity: 'high', createdAt: '2024-03-14', read: false },
  { id: '3', type: 'low_stock', message: 'Ergonomic Office Chair needs restocking (3 units)', productId: '4', severity: 'high', createdAt: '2024-03-13', read: false },
  { id: '4', type: 'order', message: 'New purchase order PO-2024-003 awaiting approval', severity: 'medium', createdAt: '2024-03-15', read: true },
  { id: '5', type: 'order', message: 'Order SO-2024-002 is ready for shipment', severity: 'low', createdAt: '2024-03-14', read: true },
];

export const chartData = {
  monthlySales: [
    { month: 'Jan', sales: 45000, purchases: 32000 },
    { month: 'Feb', sales: 52000, purchases: 28000 },
    { month: 'Mar', sales: 48000, purchases: 35000 },
    { month: 'Apr', sales: 61000, purchases: 40000 },
    { month: 'May', sales: 55000, purchases: 38000 },
    { month: 'Jun', sales: 67000, purchases: 42000 },
  ],
  categoryDistribution: [
    { name: 'Electronics', value: 35, color: '#6366f1' },
    { name: 'Clothing', value: 25, color: '#8b5cf6' },
    { name: 'Food & Beverages', value: 20, color: '#a855f7' },
    { name: 'Furniture', value: 10, color: '#d946ef' },
    { name: 'Sports', value: 5, color: '#ec4899' },
    { name: 'Beauty', value: 5, color: '#f43f5e' },
  ],
  stockLevels: [
    { name: 'Headphones', current: 45, min: 10, max: 100 },
    { name: 'Smart Watch', current: 8, min: 15, max: 80 },
    { name: 'T-Shirt', current: 150, min: 50, max: 300 },
    { name: 'Office Chair', current: 3, min: 10, max: 50 },
    { name: 'Yoga Mat', current: 75, min: 20, max: 150 },
    { name: 'Face Serum', current: 0, min: 30, max: 200 },
  ],
};
