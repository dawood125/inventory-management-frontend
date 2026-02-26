import { useState, useEffect } from 'react';
import { Layers, Plus, Edit, Trash2, Loader, Package } from 'lucide-react';
import { categoryService, productService } from '@/services';
import { cn } from '@/utils/cn';

interface Category {
  id: number;
  name: string;
  description: string | null;
}

interface CategoryWithStats extends Category {
  productCount: number;
  totalStock: number;
  totalValue: number;
}

export function Categories() {
  const [categories, setCategories] = useState<CategoryWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch categories
      const catResponse = await categoryService.getAll();
      
      // Fetch products to calculate stats
      const prodResponse = await productService.getAll();

      if (catResponse.success) {
        const categoriesWithStats = catResponse.data.categories.map((cat: Category) => {
          const categoryProducts = prodResponse.success 
            ? prodResponse.data.products.filter((p: any) => p.category_id === cat.id)
            : [];
          
          return {
            ...cat,
            productCount: categoryProducts.length,
            totalStock: categoryProducts.reduce((sum: number, p: any) => sum + p.quantity, 0),
            totalValue: categoryProducts.reduce((sum: number, p: any) => sum + (p.quantity * p.cost_price), 0),
          };
        });

        setCategories(categoriesWithStats);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await categoryService.delete(id);
      if (response.success) {
        setCategories(categories.filter(c => c.id !== id));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleSave = async (data: { name: string; description: string }) => {
    try {
      if (editingCategory) {
        const response = await categoryService.update(editingCategory.id, data);
        if (response.success) {
          fetchCategories();
        }
      } else {
        const response = await categoryService.create(data);
        if (response.success) {
          fetchCategories();
        }
      }
      setShowModal(false);
      setEditingCategory(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save category');
    }
  };

  const colors = [
    'from-indigo-500 to-indigo-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-amber-500 to-amber-600',
    'from-emerald-500 to-emerald-600',
    'from-cyan-500 to-cyan-600',
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
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-slate-500">Manage product categories</p>
        </div>
        <button 
          onClick={() => {
            setEditingCategory(null);
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div key={category.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className={cn("p-6 text-white bg-gradient-to-br", colors[index % colors.length])}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <p className="text-sm opacity-80">{category.description || 'No description'}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => {
                      setEditingCategory(category);
                      setShowModal(true);
                    }}
                    className="p-2 hover:bg-white/20 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    className="p-2 hover:bg-white/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-900">{category.productCount}</p>
                  <p className="text-xs text-slate-500">Products</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-900">{category.totalStock}</p>
                  <p className="text-xs text-slate-500">Total Stock</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">Inventory Value</p>
                <p className="text-xl font-bold text-slate-900">${category.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && !isLoading && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No categories found</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Create your first category
          </button>
        </div>
      )}

      {/* Category Modal */}
      {showModal && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setShowModal(false);
            setEditingCategory(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function CategoryModal({
  category,
  onClose,
  onSave
}: {
  category: Category | null;
  onClose: () => void;
  onSave: (data: { name: string; description: string }) => void;
}) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
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
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {category ? 'Edit Category' : 'Add New Category'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter category name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter category description"
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
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : (category ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}