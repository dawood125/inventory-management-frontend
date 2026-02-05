import { 
  Package, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp, 
  ShoppingCart,
  Truck,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { useInventory } from '@/context/InventoryContext';
import { chartData } from '@/data/mockData';
import { cn } from '@/utils/cn';

export function Dashboard() {
  const { orders, suppliers, alerts, getStats } = useInventory();
  const stats = getStats();

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      change: '+12%',
      trend: 'up',
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      change: '-5%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'bg-amber-500',
    },
    {
      title: 'Inventory Value',
      value: `$${stats.totalValue.toLocaleString()}`,
      change: '+8%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      change: '+3',
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-purple-500',
    },
  ];

  const recentOrders = orders.slice(0, 5);
  const unreadAlerts = alerts.filter(a => !a.read);

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
              <span className={cn(
                "text-sm font-medium",
                stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
              )}>
                {stat.change}
              </span>
              <span className="text-sm text-slate-400 ml-1">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales vs Purchases Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Sales vs Purchases</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.monthlySales}>
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
              <Bar dataKey="sales" fill="#6366f1" name="Sales" radius={[4, 4, 0, 0]} />
              <Bar dataKey="purchases" fill="#a855f7" name="Purchases" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Inventory by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.categoryDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.categoryDistribution.map((entry, index) => (
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
        </div>
      </div>

      {/* Stock Levels Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Stock Levels Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData.stockLevels}>
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
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
            <a href="/orders" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View All
            </a>
          </div>
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
                    <td className="py-3 px-4 text-sm font-medium text-slate-900">{order.orderNumber}</td>
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
                    <td className="py-3 px-4 text-sm text-slate-900">${order.totalAmount.toLocaleString()}</td>
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
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Alerts</h2>
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
              {unreadAlerts.length} new
            </span>
          </div>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div 
                key={alert.id} 
                className={cn(
                  "p-3 rounded-lg border",
                  !alert.read ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200"
                )}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className={cn(
                    "w-5 h-5 mt-0.5",
                    alert.severity === 'high' ? "text-red-500" :
                    alert.severity === 'medium' ? "text-amber-500" : "text-blue-500"
                  )} />
                  <div>
                    <p className="text-sm text-slate-700">{alert.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{alert.createdAt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white">
          <p className="text-indigo-100 text-sm">Active Suppliers</p>
          <p className="text-2xl font-bold mt-1">{suppliers.filter(s => s.status === 'active').length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <p className="text-purple-100 text-sm">Categories</p>
          <p className="text-2xl font-bold mt-1">{stats.totalCategories}</p>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-4 text-white">
          <p className="text-pink-100 text-sm">Out of Stock</p>
          <p className="text-2xl font-bold mt-1">{stats.outOfStockItems}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white">
          <p className="text-amber-100 text-sm">Total Orders</p>
          <p className="text-2xl font-bold mt-1">{orders.length}</p>
        </div>
      </div>
    </div>
  );
}
