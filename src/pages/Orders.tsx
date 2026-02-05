import { useState } from 'react';
import { Plus, ShoppingCart, Truck, Eye, CheckCircle, XCircle, Clock, Loader } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';
import { Order } from '@/types';
import { cn } from '@/utils/cn';

export function Orders() {
  const { orders, products, suppliers, updateOrderStatus, addOrder } = useInventory();
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesType = filterType === 'all' || order.type === filterType;
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesType && matchesStatus;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Loader className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-500">Manage purchase and sales orders</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Order
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: orders.length, color: 'bg-indigo-500' },
          { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'bg-amber-500' },
          { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, color: 'bg-blue-500' },
          { label: 'Completed', value: orders.filter(o => o.status === 'completed').length, color: 'bg-green-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white mb-2", stat.color)}>
              <ShoppingCart className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'All Types' },
            { value: 'purchase', label: 'Purchase Orders' },
            { value: 'sale', label: 'Sales Orders' }
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
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'All Status' },
            { value: 'pending', label: 'Pending' },
            { value: 'processing', label: 'Processing' },
            { value: 'completed', label: 'Completed' }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                filterStatus === tab.value
                  ? "bg-slate-900 text-white border-slate-900"
                  : "text-slate-600 border-slate-200 hover:bg-slate-50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Order #</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Type</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Items</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Status</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-900">{order.orderNumber}</p>
                    <p className="text-xs text-slate-500">
                      {order.type === 'purchase' ? order.supplier : order.customer}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                      order.type === 'purchase' 
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    )}>
                      {order.type === 'purchase' ? <Truck className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
                      {order.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-900">${order.totalAmount.toLocaleString()}</p>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{order.createdAt}</td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                      order.status === 'completed' && "bg-green-100 text-green-700",
                      order.status === 'pending' && "bg-amber-100 text-amber-700",
                      order.status === 'processing' && "bg-blue-100 text-blue-700",
                      order.status === 'cancelled' && "bg-red-100 text-red-700"
                    )}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setViewOrder(order)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {order.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'processing')}
                            className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                            title="Start Processing"
                          >
                            <Loader className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="p-2 hover:bg-green-50 rounded-lg text-green-600"
                            title="Mark Completed"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {order.status === 'processing' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="p-2 hover:bg-green-50 rounded-lg text-green-600"
                          title="Mark Completed"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No orders found</p>
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      {showModal && (
        <CreateOrderModal
          products={products}
          suppliers={suppliers}
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            addOrder(data);
            setShowModal(false);
          }}
        />
      )}

      {/* View Order Modal */}
      {viewOrder && (
        <ViewOrderModal
          order={viewOrder}
          onClose={() => setViewOrder(null)}
        />
      )}
    </div>
  );
}

function CreateOrderModal({
  products,
  suppliers,
  onClose,
  onSave
}: {
  products: { id: string; name: string; price: number; costPrice: number }[];
  suppliers: { id: string; name: string }[];
  onClose: () => void;
  onSave: (data: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => void;
}) {
  const [orderType, setOrderType] = useState<'purchase' | 'sale'>('purchase');
  const [items, setItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [supplierOrCustomer, setSupplierOrCustomer] = useState('');

  const addItem = () => {
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const existingIndex = items.findIndex(i => i.productId === selectedProduct);
    if (existingIndex >= 0) {
      const updated = [...items];
      updated[existingIndex].quantity += quantity;
      setItems(updated);
    } else {
      setItems([...items, { productId: selectedProduct, quantity }]);
    }
    setQuantity(1);
  };

  const removeItem = (productId: string) => {
    setItems(items.filter(i => i.productId !== productId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const orderItems = items.map(item => {
      const product = products.find(p => p.id === item.productId)!;
      const price = orderType === 'purchase' ? product.costPrice : product.price;
      return {
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price,
        total: price * item.quantity
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.total, 0);

    onSave({
      type: orderType,
      status: 'pending',
      items: orderItems,
      totalAmount,
      ...(orderType === 'purchase' ? { supplier: supplierOrCustomer } : { customer: supplierOrCustomer })
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Create New Order</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Order Type */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setOrderType('purchase')}
              className={cn(
                "flex-1 p-4 rounded-lg border-2 transition-colors",
                orderType === 'purchase' 
                  ? "border-indigo-600 bg-indigo-50" 
                  : "border-slate-200 hover:border-slate-300"
              )}
            >
              <Truck className={cn("w-6 h-6 mx-auto mb-2", orderType === 'purchase' ? "text-indigo-600" : "text-slate-400")} />
              <p className={cn("font-medium", orderType === 'purchase' ? "text-indigo-600" : "text-slate-600")}>Purchase Order</p>
              <p className="text-xs text-slate-500">Order from supplier</p>
            </button>
            <button
              type="button"
              onClick={() => setOrderType('sale')}
              className={cn(
                "flex-1 p-4 rounded-lg border-2 transition-colors",
                orderType === 'sale' 
                  ? "border-indigo-600 bg-indigo-50" 
                  : "border-slate-200 hover:border-slate-300"
              )}
            >
              <ShoppingCart className={cn("w-6 h-6 mx-auto mb-2", orderType === 'sale' ? "text-indigo-600" : "text-slate-400")} />
              <p className={cn("font-medium", orderType === 'sale' ? "text-indigo-600" : "text-slate-600")}>Sales Order</p>
              <p className="text-xs text-slate-500">Sell to customer</p>
            </button>
          </div>

          {/* Supplier/Customer */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {orderType === 'purchase' ? 'Supplier' : 'Customer'}
            </label>
            {orderType === 'purchase' ? (
              <select
                required
                value={supplierOrCustomer}
                onChange={(e) => setSupplierOrCustomer(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select supplier</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                required
                placeholder="Customer name"
                value={supplierOrCustomer}
                onChange={(e) => setSupplierOrCustomer(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>

          {/* Add Items */}
          <div className="border border-slate-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Add Products</label>
            <div className="flex gap-2">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} - ${orderType === 'purchase' ? p.costPrice : p.price}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-20 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={addItem}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                Add
              </button>
            </div>

            {/* Items List */}
            {items.length > 0 && (
              <div className="mt-4 space-y-2">
                {items.map(item => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;
                  const price = orderType === 'purchase' ? product.costPrice : product.price;
                  return (
                    <div key={item.productId} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{product.name}</p>
                        <p className="text-sm text-slate-500">{item.quantity} x ${price} = ${(item.quantity * price).toFixed(2)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="font-semibold text-slate-900">Total:</span>
                  <span className="font-bold text-slate-900">
                    ${items.reduce((sum, item) => {
                      const product = products.find(p => p.id === item.productId);
                      const price = orderType === 'purchase' ? (product?.costPrice || 0) : (product?.price || 0);
                      return sum + (item.quantity * price);
                    }, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
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
              disabled={items.length === 0}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ViewOrderModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{order.orderNumber}</h2>
              <p className="text-sm text-slate-500">{order.createdAt}</p>
            </div>
            <span className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              order.status === 'completed' && "bg-green-100 text-green-700",
              order.status === 'pending' && "bg-amber-100 text-amber-700",
              order.status === 'processing' && "bg-blue-100 text-blue-700"
            )}>
              {order.status}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-slate-500">
              {order.type === 'purchase' ? 'Supplier' : 'Customer'}
            </p>
            <p className="font-medium text-slate-900">
              {order.type === 'purchase' ? order.supplier : order.customer}
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-2 px-4 text-sm font-medium text-slate-600">Item</th>
                  <th className="text-right py-2 px-4 text-sm font-medium text-slate-600">Qty</th>
                  <th className="text-right py-2 px-4 text-sm font-medium text-slate-600">Price</th>
                  <th className="text-right py-2 px-4 text-sm font-medium text-slate-600">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, i) => (
                  <tr key={i}>
                    <td className="py-2 px-4 text-sm text-slate-900">{item.productName}</td>
                    <td className="py-2 px-4 text-sm text-slate-600 text-right">{item.quantity}</td>
                    <td className="py-2 px-4 text-sm text-slate-600 text-right">${item.price.toFixed(2)}</td>
                    <td className="py-2 px-4 text-sm font-medium text-slate-900 text-right">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50">
                <tr>
                  <td colSpan={3} className="py-3 px-4 text-sm font-semibold text-slate-900">Total Amount</td>
                  <td className="py-3 px-4 text-lg font-bold text-slate-900 text-right">${order.totalAmount.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
