import { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp, 
  ShoppingCart,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  Loader
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  Legend 
} from 'recharts';
import { Link } from 'react-router-dom';
import { reportService, orderService, productService, categoryService } from '@/services';
import { cn } from '@/utils/cn';

interface DashboardStats {
  products: {
    total: number;
    active: number;
    low_stock: number;
    out_of_stock: number;
  };
  inventory: {
    total_value: number;
  };
  categories: {
    total: number;
  };
  suppliers: {
    total_active: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    today: number;
  };
  sales: {
    total: number;
    today: number;
    this_month: number;
  };
  purchases: {
    total: number;
    this_month: number;
  };
  profit: {
    total: number;
    this_month: number;
  };
}

interface Order {
  id: number;
  order_number: string;
  type: 'purchase' | 'sale';
  status: string;
  total_amount: number;
  created_at: string;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface StockLevelData {
  name: string;
  current: number;
  min: number;
  max: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [stockLevelData, setStockLevelData] = useState<StockLevelData[]>([]);
  const [monthlySalesData, setMonthlySalesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Colors for pie chart
  const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch all data in parallel
      const [statsResponse, ordersResponse, productsResponse, categoriesResponse, salesReportResponse] = await Promise.all([
        reportService.getDashboard(),
        orderService.getAll(),
        productService.getAll(),
        categoryService.getAll(),
        reportService.getSales()
      ]);

      // Set dashboard stats
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Set recent orders
      if (ordersResponse.success) {
        setRecentOrders(ordersResponse.data.orders.slice(0, 5));
      }

      // Calculate category distribution for pie chart
      if (categoriesResponse.success && productsResponse.success) {
        const categories = categoriesResponse.data.categories;
        const products = productsResponse.data.products;

        const catData = categories.map((cat: any, index: number) => {
          const categoryProducts = products.filter((p: any) => p.category_id === cat.id);
          return {
            name: cat.name,
            value: categoryProducts.length,
            color: COLORS[index % COLORS.length]
          };
        }).filter((c: CategoryData) => c.value > 0);

        setCategoryData(catData);

        // Calculate stock levels for line chart (top 6 products)
        const stockData = products.slice(0, 6).map((p: any) => ({
          name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
          current: p.quantity,
          min: p.min_stock,
          max: p.max_stock
        }));

        setStockLevelData(stockData);
      }

      // Set monthly sales data for bar chart
      if (salesReportResponse.success && salesReportResponse.data.monthly_sales) {
        setMonthlySalesData(salesReportResponse.data.monthly_sales);
      } else {
        // Create sample data if no monthly data available
        setMonthlySalesData([
          { month: 'Jan', sales: 0, purchases: 0 },
          { month: 'Feb', sales: 0, purchases: 0 },
          { month: 'Mar', sales: 0, purchases: 0 },
          { month: 'Apr', sales: 0, purchases: 0 },
          { month: 'May', sales: 0, purchases: 0 },
          { month: 'Jun', sales: 0, purchases: 0 },
        ]);
      }

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.products.total || 0,
      change: `${stats?.products.active || 0} active`,
      trend: 'up',
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Low Stock Items',
      value: stats?.products.low_stock || 0,
      change: `${stats?.products.out_of_stock || 0} out of stock`,
      trend: stats?.products.low_stock && stats.products.low_stock > 0 ? 'down' : 'up',
      icon: AlertTriangle,
      color: 'bg-amber-500',
    },
    {
      title: 'Inventory Value',
      value: `$${(stats?.inventory.total_value || 0).toLocaleString()}`,
      change: 'Total cost value',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Orders',
      value: stats?.orders.pending || 0,
      change: `${stats?.orders.today || 0} today`,
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Welcome back! Here's what's happening with your inventory.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={cn("p-3 rounded-lg", stat.color)}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              {stat.trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm text-slate-500">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales vs Purchases Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Sales Overview</h2>
          {monthlySalesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Bar dataKey="total" fill="#6366f1" name="Sales" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
              No sales data available yet
            </div>
          )}
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Products by Category</h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
              No category data available yet
            </div>
          )}
        </div>
      </div>

      {/* Stock Levels Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Stock Levels Overview</h2>
        {stockLevelData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stockLevelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Line type="monotone" dataKey="current" stroke="#6366f1" strokeWidth={2} name="Current Stock" />
              <Line type="monotone" dataKey="min" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Min Level" />
              <Line type="monotone" dataKey="max" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Max Level" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-slate-500">
            No stock data available yet
          </div>
        )}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
            <Link to="/orders" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View All
            </Link>
          </div>
          
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Order #</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm font-medium text-slate-900">{order.order_number}</td>
                      <td className="py-3 px-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                          order.type === 'purchase' 
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        )}>
                          {order.type === 'purchase' ? <Truck className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                          {order.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-900">${order.total_amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          order.status === 'completed' && "bg-green-100 text-green-700",
                          order.status === 'pending' && "bg-amber-100 text-amber-700",
                          order.status === 'processing' && "bg-blue-100 text-blue-700",
                          order.status === 'cancelled' && "bg-red-100 text-red-700"
                        )}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-slate-500 py-8">No orders yet</p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white">
              <p className="text-green-100 text-sm">Total Sales</p>
              <p className="text-2xl font-bold">${(stats?.sales.total || 0).toLocaleString()}</p>
              <p className="text-green-100 text-xs mt-1">This month: ${(stats?.sales.this_month || 0).toLocaleString()}</p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
              <p className="text-blue-100 text-sm">Total Purchases</p>
              <p className="text-2xl font-bold">${(stats?.purchases.total || 0).toLocaleString()}</p>
              <p className="text-blue-100 text-xs mt-1">This month: ${(stats?.purchases.this_month || 0).toLocaleString()}</p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white">
              <p className="text-purple-100 text-sm">Profit</p>
              <p className="text-2xl font-bold">${(stats?.profit.total || 0).toLocaleString()}</p>
              <p className="text-purple-100 text-xs mt-1">This month: ${(stats?.profit.this_month || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white">
          <p className="text-indigo-100 text-sm">Active Suppliers</p>
          <p className="text-2xl font-bold mt-1">{stats?.suppliers.total_active || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-4 text-white">
          <p className="text-pink-100 text-sm">Categories</p>
          <p className="text-2xl font-bold mt-1">{stats?.categories.total || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white">
          <p className="text-amber-100 text-sm">Out of Stock</p>
          <p className="text-2xl font-bold mt-1">{stats?.products.out_of_stock || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-4 text-white">
          <p className="text-cyan-100 text-sm">Total Orders</p>
          <p className="text-2xl font-bold mt-1">{stats?.orders.total || 0}</p>
        </div>
      </div>
    </div>
  );
}