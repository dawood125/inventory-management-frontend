import { useState, useEffect } from 'react';
import { FileText, Download, TrendingUp, TrendingDown, DollarSign, Package, BarChart3, Loader } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';
import { reportService } from '@/services';
import { cn } from '@/utils/cn';

export function Reports() {
  const [activeReport, setActiveReport] = useState('overview');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [inventoryData, setInventoryData] = useState<any>(null);
  const [salesData, setSalesData] = useState<any>(null);
  const [purchasesData, setPurchasesData] = useState<any>(null);
  const [lowStockData, setLowStockData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];

  useEffect(() => {
    fetchReportData();
  }, [activeReport]);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      setError('');

      switch (activeReport) {
        case 'overview':
          const dashRes = await reportService.getDashboard();
          if (dashRes.success) setDashboardData(dashRes.data);
          break;
        case 'inventory':
          const invRes = await reportService.getInventory();
          if (invRes.success) setInventoryData(invRes.data);
          break;
        case 'sales':
          const salesRes = await reportService.getSales();
          if (salesRes.success) setSalesData(salesRes.data);
          break;
        case 'purchases':
          const purchRes = await reportService.getPurchases();
          if (purchRes.success) setPurchasesData(purchRes.data);
          break;
      }

      // Also fetch low stock for overview
      if (activeReport === 'overview') {
        const lowStockRes = await reportService.getLowStock();
        if (lowStockRes.success) setLowStockData(lowStockRes.data);
      }

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load report data');
    } finally {
      setIsLoading(false);
    }
  };

  const reportTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'inventory', label: 'Inventory Report', icon: Package },
    { id: 'sales', label: 'Sales Report', icon: TrendingUp },
    { id: 'purchases', label: 'Purchase Report', icon: TrendingDown },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

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

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
          {error}
        </div>
      )}

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
      {activeReport === 'overview' && dashboardData && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Sales</p>
                  <p className="text-2xl font-bold text-slate-900">${(dashboardData.sales?.total || 0).toLocaleString()}</p>
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
                  <p className="text-2xl font-bold text-slate-900">${(dashboardData.purchases?.total || 0).toLocaleString()}</p>
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
                  <p className={cn("text-2xl font-bold", (dashboardData.profit?.total || 0) >= 0 ? "text-green-600" : "text-red-600")}>
                    ${(dashboardData.profit?.total || 0).toLocaleString()}
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
                  <p className="text-2xl font-bold text-slate-900">${(dashboardData.inventory?.total_value || 0).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Package className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          {lowStockData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Low Stock Products</h3>
                {lowStockData.low_stock_products?.length > 0 ? (
                  <div className="space-y-4">
                    {lowStockData.low_stock_products.slice(0, 5).map((product: any) => (
                      <div key={product.id} className="flex items-center gap-4 p-3 bg-amber-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{product.name}</p>
                          <p className="text-sm text-slate-500">Min: {product.min_stock}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-amber-600">{product.current_stock}</p>
                          <p className="text-xs text-slate-500">in stock</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-slate-500">All products are well stocked!</p>
                )}
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Out of Stock Products</h3>
                {lowStockData.out_of_stock_products?.length > 0 ? (
                  <div className="space-y-4">
                    {lowStockData.out_of_stock_products.slice(0, 5).map((product: any) => (
                      <div key={product.id} className="flex items-center gap-4 p-3 bg-red-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{product.name}</p>
                          <p className="text-sm text-slate-500">Reorder: {product.reorder_quantity} units</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-red-600">0</p>
                          <p className="text-xs text-slate-500">in stock</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-slate-500">No products are out of stock!</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inventory Report */}
      {activeReport === 'inventory' && inventoryData && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-900">Inventory Valuation Report</h3>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-sm text-slate-500">Total Products</p>
                <p className="text-xl font-bold text-slate-900">{inventoryData.summary?.total_products || 0}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-sm text-slate-500">Total Items</p>
                <p className="text-xl font-bold text-slate-900">{inventoryData.summary?.total_items || 0}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-sm text-slate-500">Cost Value</p>
                <p className="text-xl font-bold text-slate-900">${(inventoryData.summary?.total_cost_value || 0).toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-sm text-slate-500">Retail Value</p>
                <p className="text-xl font-bold text-slate-900">${(inventoryData.summary?.total_retail_value || 0).toLocaleString()}</p>
              </div>
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
                {inventoryData.products?.map((product: any) => (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="py-3 px-6 font-medium text-slate-900">{product.name}</td>
                    <td className="py-3 px-6 font-mono text-sm text-slate-600">{product.sku}</td>
                    <td className="py-3 px-6 text-right text-slate-900">{product.quantity}</td>
                    <td className="py-3 px-6 text-right text-slate-600">${product.cost_price?.toFixed(2)}</td>
                    <td className="py-3 px-6 text-right font-semibold text-slate-900">
                      ${product.stock_value?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sales Report */}
      {activeReport === 'sales' && salesData && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">Total Sales</p>
              <p className="text-2xl font-bold text-green-600">${(salesData.summary?.total_sales || 0).toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">Total Orders</p>
              <p className="text-2xl font-bold text-slate-900">{salesData.summary?.total_orders || 0}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">Completed</p>
              <p className="text-2xl font-bold text-slate-900">{salesData.summary?.completed_orders || 0}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">Avg Order Value</p>
              <p className="text-2xl font-bold text-slate-900">${(salesData.summary?.average_order_value || 0).toLocaleString()}</p>
            </div>
          </div>

          {salesData.monthly_sales?.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Sales</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData.monthly_sales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="total" fill="#6366f1" name="Sales" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Purchases Report */}
      {activeReport === 'purchases' && purchasesData && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">Total Purchases</p>
              <p className="text-2xl font-bold text-blue-600">${(purchasesData.summary?.total_purchases || 0).toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">Total Orders</p>
              <p className="text-2xl font-bold text-slate-900">{purchasesData.summary?.total_orders || 0}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">Completed</p>
              <p className="text-2xl font-bold text-slate-900">{purchasesData.summary?.completed_orders || 0}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500">Avg Order Value</p>
              <p className="text-2xl font-bold text-slate-900">${(purchasesData.summary?.average_order_value || 0).toLocaleString()}</p>
            </div>
          </div>

          {purchasesData.monthly_purchases?.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Purchases</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={purchasesData.monthly_purchases}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="total" fill="#8b5cf6" name="Purchases" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {purchasesData.top_suppliers?.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Suppliers</h3>
              <div className="space-y-3">
                {purchasesData.top_suppliers.map((supplier: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{supplier.supplier_name}</p>
                      <p className="text-sm text-slate-500">{supplier.order_count} orders</p>
                    </div>
                    <p className="font-bold text-slate-900">${supplier.total_amount?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}