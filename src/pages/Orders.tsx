import { useState, useEffect } from 'react';
import { Plus, ShoppingCart, Truck, Eye, CheckCircle, XCircle, Clock, Loader as LoaderIcon } from 'lucide-react';
import { orderService, productService, supplierService } from '@/services';
import { cn } from '@/utils/cn';

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: number;
  order_number: string;
  type: 'purchase' | 'sale';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total_amount: number;
  supplier_id: number | null;
  customer_name: string | null;
  items: OrderItem[];
  supplier?: { id: number; name: string };
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  cost_price: number;
  quantity: number;
}

interface Supplier {
  id: number;
  name: string;
}

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [ordersRes, productsRes, suppliersRes] = await Promise.all([
        orderService.getAll(),
        productService.getAll(),
        supplierService.getAll({ status: 'active' })
      ]);

      if (ordersRes.success) setOrders(ordersRes.data.orders);
      if (productsRes.success) setProducts(productsRes.data.products);
      if (suppliersRes.success) setSuppliers(suppliersRes.data.suppliers);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesType = filterType === 'all' || order.type === filterType;
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesType && matchesStatus;
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const handleUpdateStatus = async (id: number, status: Order['status']) => {
    try {
      const response = await orderService.updateStatus(id, status);
      if (response.success) {
        fetchData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleCreateOrder = async (data: any) => {
    try {
      const response = await orderService.create(data);
      if (response.success) {
        fetchData();
        setShowModal(false);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create order');
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <LoaderIcon className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoaderIcon className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

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

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
          {error}
        </div>
      )}

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
                    <p className="font-medium text-slate-900">{order.order_number}</p>
                    <p className="text-xs text-slate-500">
                      {order.type === 'purchase' ? order.supplier?.name : order.customer_name}
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
                    {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-900">${order.total_amount.toLocaleString()}</p>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
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
                            onClick={() => handleUpdateStatus(order.id, 'processing')}
                            className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                            title="Start Processing"
                          >
                            <LoaderIcon className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(order.id, 'completed')}
                            className="p-2 hover:bg-green-50 rounded-lg text-green-600"
                            title="Mark Completed"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {order.status === 'processing' && (
                        <button 
                          onClick={() => handleUpdateStatus(order.id, 'completed')}
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
          onSave={handleCreateOrder}
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
  products: Product[];
  suppliers: Supplier[];
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [orderType, setOrderType] = useState<'purchase' | 'sale'>('purchase');
  const [items, setItems] = useState<{ product_id: number; quantity: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || 0);
  const [quantity, setQuantity] = useState(1);
  const [supplierOrCustomer, setSupplierOrCustomer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addItem = () => {
    if (!selectedProduct) return;

    const existingIndex = items.findIndex(i => i.product_id === selectedProduct);
    if (existingIndex >= 0) {
      const updated = [...items];
      updated[existingIndex].quantity += quantity;
      setItems(updated);
    } else {
      setItems([...items, { product_id: selectedProduct, quantity }]);
    }
    setQuantity(1);
  };

  const removeItem = (productId: number) => {
    setItems(items.filter(i => i.product_id !== productId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    setIsLoading(true);

    const orderData = {
      type: orderType,
      items: items,
      ...(orderType === 'purchase' 
        ? { supplier_id: parseInt(supplierOrCustomer) } 
        : { customer_name: supplierOrCustomer }
      )
    };

    await onSave(orderData);
    setIsLoading(false);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.product_id);
      const price = orderType === 'purchase' ? (product?.cost_price || 0) : (product?.price || 0);
      return sum + (item.quantity * price);
    }, 0);
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
              {orderType === 'purchase' ? 'Supplier' : 'Customer Name'}
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
                  <option key={s.id} value={s.id}>{s.name}</option>
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
                onChange={(e) => setSelectedProduct(parseInt(e.target.value))}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} - ${orderType === 'purchase' ? p.cost_price : p.price} (Stock: {p.quantity})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
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
                  const product = products.find(p => p.id === item.product_id);
                  if (!product) return null;
                  const price = orderType === 'purchase' ? product.cost_price : product.price;
                  return (
                    <div key={item.product_id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{product.name}</p>
                        <p className="text-sm text-slate-500">{item.quantity} x ${price} = ${(item.quantity * price).toFixed(2)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product_id)}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="font-semibold text-slate-900">Total:</span>
                  <span className="font-bold text-slate-900">${calculateTotal().toFixed(2)}</span>
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
              disabled={items.length === 0 || isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Order'}
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
              <h2 className="text-xl font-bold text-slate-900">{order.order_number}</h2>
              <p className="text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
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
              {order.type === 'purchase' ? order.supplier?.name : order.customer_name}
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
                {order.items?.map((item, i) => (
                  <tr key={i}>
                    <td className="py-2 px-4 text-sm text-slate-900">{item.product_name}</td>
                    <td className="py-2 px-4 text-sm text-slate-600 text-right">{item.quantity}</td>
                    <td className="py-2 px-4 text-sm text-slate-600 text-right">${item.price.toFixed(2)}</td>
                    <td className="py-2 px-4 text-sm font-medium text-slate-900 text-right">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50">
                <tr>
                  <td colSpan={3} className="py-3 px-4 text-sm font-semibold text-slate-900">Total Amount</td>
                  <td className="py-3 px-4 text-lg font-bold text-slate-900 text-right">${order.total_amount.toLocaleString()}</td>
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