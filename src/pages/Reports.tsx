import { useState } from 'react';
import { FileText, Download, TrendingUp, TrendingDown, DollarSign, Package, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';
import { useInventory } from '@/context/InventoryContext';
import { chartData } from '@/data/mockData';
import { cn } from '@/utils/cn';

export function Reports() {
  const { products, orders } = useInventory();
  const [activeReport, setActiveReport] = useState('overview');

  // Calculate report data
  const totalRevenue = orders
    .filter(o => o.type === 'sale' && o.status === 'completed')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalPurchases = orders
    .filter(o => o.type === 'purchase' && o.status === 'completed')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const profit = totalRevenue - totalPurchases;

  const inventoryValue = products.reduce((sum, p) => sum + (p.quantity * p.costPrice), 0);

  const topProducts = [...products]
    .sort((a, b) => (b.quantity * b.price) - (a.quantity * a.price))
    .slice(0, 5);

  const lowStockProducts = products
    .filter(p => p.quantity <= p.minStock)
    .sort((a, b) => a.quantity - b.quantity);

  const reportTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'inventory', label: 'Inventory Report', icon: Package },
    { id: 'sales', label: 'Sales Report', icon: TrendingUp },
    { id: 'purchases', label: 'Purchase Report', icon: TrendingDown },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-500">View detailed reports and insights</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      {/* Report Tabs */}
      <div className="flex gap-2 bg-white rounded-xl p-2 shadow-sm border border-slate-200 overflow-x-auto">
        {reportTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
              activeReport === tab.id
                ? "bg-indigo-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Report */}
      {activeReport === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Purchases</p>
                  <p className="text-2xl font-bold text-slate-900">${totalPurchases.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrendingDown className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Net Profit</p>
                  <p className={cn("text-2xl font-bold", profit >= 0 ? "text-green-600" : "text-red-600")}>
                    ${profit.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Inventory Value</p>
                  <p className="text-2xl font-bold text-slate-900">${inventoryValue.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Package className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue vs Cost Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData.monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="sales" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} name="Sales" />
                  <Area type="monotone" dataKey="purchases" stackId="2" stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} name="Purchases" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Category Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {chartData.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products & Low Stock */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Products by Value</h3>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{product.name}</p>
                      <p className="text-sm text-slate-500">{product.quantity} units × ${product.price}</p>
                    </div>
                    <p className="font-bold text-slate-900">${(product.quantity * product.price).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Low Stock Alert</h3>
              {lowStockProducts.length > 0 ? (
                <div className="space-y-4">
                  {lowStockProducts.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-3 bg-red-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{product.name}</p>
                        <p className="text-sm text-slate-500">Min: {product.minStock} | Max: {product.maxStock}</p>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "text-lg font-bold",
                          product.quantity === 0 ? "text-red-600" : "text-amber-600"
                        )}>
                          {product.quantity}
                        </p>
                        <p className="text-xs text-slate-500">in stock</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-slate-500">All products are well stocked!</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Inventory Report */}
      {activeReport === 'inventory' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-900">Inventory Valuation Report</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-slate-600">Product</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-slate-600">SKU</th>
                  <th className="text-right py-3 px-6 text-sm font-semibold text-slate-600">Quantity</th>
                  <th className="text-right py-3 px-6 text-sm font-semibold text-slate-600">Unit Cost</th>
                  <th className="text-right py-3 px-6 text-sm font-semibold text-slate-600">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="py-3 px-6 font-medium text-slate-900">{product.name}</td>
                    <td className="py-3 px-6 font-mono text-sm text-slate-600">{product.sku}</td>
                    <td className="py-3 px-6 text-right text-slate-900">{product.quantity}</td>
                    <td className="py-3 px-6 text-right text-slate-600">${product.costPrice.toFixed(2)}</td>
                    <td className="py-3 px-6 text-right font-semibold text-slate-900">
                      ${(product.quantity * product.costPrice).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100">
                <tr>
                  <td colSpan={4} className="py-3 px-6 font-bold text-slate-900">Total Inventory Value</td>
                  <td className="py-3 px-6 text-right font-bold text-lg text-indigo-600">
                    ${inventoryValue.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Sales Report */}
      {activeReport === 'sales' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Sales Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="sales" fill="#6366f1" name="Sales" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Sales Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-slate-600">Order #</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-slate-600">Customer</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-slate-600">Date</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-slate-600">Status</th>
                    <th className="text-right py-3 px-6 text-sm font-semibold text-slate-600">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.filter(o => o.type === 'sale').map(order => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="py-3 px-6 font-medium text-slate-900">{order.orderNumber}</td>
                      <td className="py-3 px-6 text-slate-600">{order.customer}</td>
                      <td className="py-3 px-6 text-slate-600">{order.createdAt}</td>
                      <td className="py-3 px-6">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          order.status === 'completed' && "bg-green-100 text-green-700",
                          order.status === 'pending' && "bg-amber-100 text-amber-700",
                          order.status === 'processing' && "bg-blue-100 text-blue-700"
                        )}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right font-semibold text-slate-900">
                        ${order.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Purchases Report */}
      {activeReport === 'purchases' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Purchase Spending</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="purchases" fill="#a855f7" name="Purchases" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Purchase Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-slate-600">Order #</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-slate-600">Supplier</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-slate-600">Date</th>
                    <th className="text-left py-3 px-6 text-sm font-semibold text-slate-600">Status</th>
                    <th className="text-right py-3 px-6 text-sm font-semibold text-slate-600">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.filter(o => o.type === 'purchase').map(order => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="py-3 px-6 font-medium text-slate-900">{order.orderNumber}</td>
                      <td className="py-3 px-6 text-slate-600">{order.supplier}</td>
                      <td className="py-3 px-6 text-slate-600">{order.createdAt}</td>
                      <td className="py-3 px-6">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          order.status === 'completed' && "bg-green-100 text-green-700",
                          order.status === 'pending' && "bg-amber-100 text-amber-700",
                          order.status === 'processing' && "bg-blue-100 text-blue-700"
                        )}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right font-semibold text-slate-900">
                        ${order.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
