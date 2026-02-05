import { useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, RefreshCw, Package } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';
import { cn } from '@/utils/cn';

export function Stock() {
  const { products, stockMovements, addStockMovement } = useInventory();
  const [showModal, setShowModal] = useState(false);
  const [movementType, setMovementType] = useState<'in' | 'out' | 'adjustment'>('in');
  const [filterType, setFilterType] = useState('all');

  const filteredMovements = stockMovements
    .filter(m => filterType === 'all' || m.type === filterType)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const openModal = (type: 'in' | 'out' | 'adjustment') => {
    setMovementType(type);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Stock Management</h1>
          <p className="text-slate-500">Track stock movements and adjustments</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => openModal('in')}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <ArrowDownCircle className="w-5 h-5" />
            Stock In
          </button>
          <button 
            onClick={() => openModal('out')}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <ArrowUpCircle className="w-5 h-5" />
            Stock Out
          </button>
          <button 
            onClick={() => openModal('adjustment')}
            className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Adjust
          </button>
        </div>
      </div>

      {/* Quick Stock Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.slice(0, 4).map(product => (
          <div key={product.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">{product.name}</p>
                <p className="text-xs text-slate-500">{product.sku}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-900">{product.quantity}</p>
                <p className="text-xs text-slate-500">in stock</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  {product.quantity <= product.minStock ? (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Low Stock</span>
                  ) : (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">In Stock</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">Min: {product.minStock}</p>
              </div>
            </div>
            <div className="mt-3 w-full bg-slate-200 rounded-full h-2">
              <div 
                className={cn(
                  "h-2 rounded-full",
                  product.quantity === 0 ? "bg-red-500" :
                  product.quantity <= product.minStock ? "bg-amber-500" : "bg-green-500"
                )}
                style={{ width: `${Math.min((product.quantity / product.maxStock) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-white rounded-xl p-2 shadow-sm border border-slate-200 w-fit">
        {[
          { value: 'all', label: 'All Movements' },
          { value: 'in', label: 'Stock In' },
          { value: 'out', label: 'Stock Out' },
          { value: 'adjustment', label: 'Adjustments' }
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilterType(tab.value)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              filterType === tab.value
                ? "bg-indigo-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stock Movements Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Product</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Type</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Quantity</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Reason</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Reference</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMovements.map((movement) => (
                <tr key={movement.id} className="hover:bg-slate-50">
                  <td className="py-4 px-6 text-sm text-slate-600">{movement.createdAt}</td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-900">{movement.productName}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                      movement.type === 'in' && "bg-green-100 text-green-700",
                      movement.type === 'out' && "bg-red-100 text-red-700",
                      movement.type === 'adjustment' && "bg-amber-100 text-amber-700"
                    )}>
                      {movement.type === 'in' && <ArrowDownCircle className="w-3 h-3" />}
                      {movement.type === 'out' && <ArrowUpCircle className="w-3 h-3" />}
                      {movement.type === 'adjustment' && <RefreshCw className="w-3 h-3" />}
                      {movement.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "font-medium",
                      movement.type === 'in' ? "text-green-600" :
                      movement.type === 'out' ? "text-red-600" : "text-amber-600"
                    )}>
                      {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : ''}
                      {Math.abs(movement.quantity)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{movement.reason}</td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm text-slate-600">{movement.reference}</span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{movement.createdBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMovements.length === 0 && (
          <div className="text-center py-12">
            <RefreshCw className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No stock movements found</p>
          </div>
        )}
      </div>

      {/* Stock Movement Modal */}
      {showModal && (
        <StockMovementModal
          type={movementType}
          products={products}
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            addStockMovement(data);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

function StockMovementModal({
  type,
  products,
  onClose,
  onSave
}: {
  type: 'in' | 'out' | 'adjustment';
  products: { id: string; name: string; quantity: number }[];
  onClose: () => void;
  onSave: (data: { productId: string; productName: string; type: 'in' | 'out' | 'adjustment'; quantity: number; reason: string; reference: string; createdBy: string }) => void;
}) {
  const [formData, setFormData] = useState({
    productId: products[0]?.id || '',
    quantity: 0,
    reason: '',
    reference: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === formData.productId);
    if (!product) return;

    onSave({
      productId: formData.productId,
      productName: product.name,
      type,
      quantity: type === 'adjustment' ? formData.quantity : Math.abs(formData.quantity),
      reason: formData.reason,
      reference: formData.reference || `${type.toUpperCase()}-${Date.now()}`,
      createdBy: 'John Admin'
    });
  };

  const titles = {
    in: 'Stock In',
    out: 'Stock Out',
    adjustment: 'Stock Adjustment'
  };

  const colors = {
    in: 'bg-green-600 hover:bg-green-700',
    out: 'bg-red-600 hover:bg-red-700',
    adjustment: 'bg-amber-600 hover:bg-amber-700'
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">{titles[type]}</h2>
          <p className="text-sm text-slate-500 mt-1">
            {type === 'in' && 'Add stock to inventory'}
            {type === 'out' && 'Remove stock from inventory'}
            {type === 'adjustment' && 'Adjust stock levels (use negative for decrease)'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product</label>
            <select
              required
              value={formData.productId}
              onChange={(e) => setFormData({...formData, productId: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} (Current: {product.quantity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
            <input
              type="number"
              required
              min={type === 'adjustment' ? undefined : 1}
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
            <input
              type="text"
              required
              placeholder="e.g., Purchase order, Damaged goods, etc."
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reference (Optional)</label>
            <input
              type="text"
              placeholder="e.g., PO-2024-001"
              value={formData.reference}
              onChange={(e) => setFormData({...formData, reference: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={cn("px-4 py-2 text-white rounded-lg transition-colors", colors[type])}
            >
              Confirm {titles[type]}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
