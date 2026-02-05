import { Layers, Package } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';
import { cn } from '@/utils/cn';

export function Categories() {
  const { categories, products } = useInventory();

  const getCategoryStats = (categoryName: string) => {
    const categoryProducts = products.filter(p => p.category === categoryName);
    const totalValue = categoryProducts.reduce((sum, p) => sum + (p.quantity * p.costPrice), 0);
    const totalStock = categoryProducts.reduce((sum, p) => sum + p.quantity, 0);
    const lowStockCount = categoryProducts.filter(p => p.quantity <= p.minStock && p.quantity > 0).length;
    const outOfStockCount = categoryProducts.filter(p => p.quantity === 0).length;
    return { count: categoryProducts.length, totalValue, totalStock, lowStockCount, outOfStockCount };
  };

  const colors = [
    'from-indigo-500 to-indigo-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-amber-500 to-amber-600',
    'from-emerald-500 to-emerald-600',
    'from-cyan-500 to-cyan-600',
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
        <p className="text-slate-500">Overview of product categories and their inventory</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => {
          const stats = getCategoryStats(category.name);
          return (
            <div key={category.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className={cn("p-6 text-white bg-gradient-to-br", colors[index % colors.length])}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <p className="text-sm opacity-80">{category.description}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-slate-900">{stats.count}</p>
                    <p className="text-xs text-slate-500">Products</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-slate-900">{stats.totalStock}</p>
                    <p className="text-xs text-slate-500">Total Stock</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Inventory Value</p>
                  <p className="text-xl font-bold text-slate-900">${stats.totalValue.toLocaleString()}</p>
                </div>

                <div className="mt-4 flex gap-2">
                  {stats.lowStockCount > 0 && (
                    <span className="flex-1 text-center px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">
                      {stats.lowStockCount} Low Stock
                    </span>
                  )}
                  {stats.outOfStockCount > 0 && (
                    <span className="flex-1 text-center px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium">
                      {stats.outOfStockCount} Out of Stock
                    </span>
                  )}
                  {stats.lowStockCount === 0 && stats.outOfStockCount === 0 && (
                    <span className="flex-1 text-center px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                      All Stocked
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Products by Category */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Products by Category</h2>
        <div className="space-y-4">
          {categories.map((category) => {
            const stats = getCategoryStats(category.name);
            const percentage = products.length > 0 ? (stats.count / products.length) * 100 : 0;
            return (
              <div key={category.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{category.name}</span>
                  </div>
                  <span className="text-sm text-slate-500">{stats.count} products ({percentage.toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
