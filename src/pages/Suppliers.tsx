import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Star, Phone, Mail, MapPin, Truck, Loader } from 'lucide-react';
import { supplierService } from '@/services';
import { cn } from '@/utils/cn';

interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: 'active' | 'inactive';
  rating: number;
  total_orders: number;
  created_at: string;
}

export function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await supplierService.getAll();
      if (response.success) {
        setSuppliers(response.data.suppliers);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load suppliers');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return;

    try {
      const response = await supplierService.delete(id);
      if (response.success) {
        setSuppliers(suppliers.filter(s => s.id !== id));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete supplier');
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editingSupplier) {
        const response = await supplierService.update(editingSupplier.id, data);
        if (response.success) {
          fetchSuppliers();
        }
      } else {
        const response = await supplierService.create(data);
        if (response.success) {
          fetchSuppliers();
        }
      }
      setShowModal(false);
      setEditingSupplier(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save supplier');
    }
  };

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
          <h1 className="text-2xl font-bold text-slate-900">Suppliers</h1>
          <p className="text-slate-500">Manage your suppliers and vendors</p>
        </div>
        <button 
          onClick={() => {
            setEditingSupplier(null);
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Supplier
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                statusFilter === tab.value
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {supplier.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{supplier.name}</h3>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    supplier.status === 'active' 
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  )}>
                    {supplier.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => {
                    setEditingSupplier(supplier);
                    setShowModal(true);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(supplier.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{supplier.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{supplier.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{supplier.city}, {supplier.country}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-slate-900">{supplier.rating}</span>
                <span className="text-slate-400 text-sm">/ 5.0</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-slate-600">
                <Truck className="w-4 h-4 text-slate-400" />
                <span>{supplier.total_orders} orders</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSuppliers.length === 0 && !isLoading && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No suppliers found</p>
        </div>
      )}

      {/* Supplier Modal */}
      {showModal && (
        <SupplierModal
          supplier={editingSupplier}
          onClose={() => {
            setShowModal(false);
            setEditingSupplier(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function SupplierModal({
  supplier,
  onClose,
  onSave
}: {
  supplier: Supplier | null;
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    address: supplier?.address || '',
    city: supplier?.city || '',
    country: supplier?.country || '',
    status: supplier?.status || 'active',
    rating: supplier?.rating || 4.0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSave(formData);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {supplier ? 'Edit Supplier' : 'Add New Supplier'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : (supplier ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}