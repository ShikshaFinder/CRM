'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '../../../components/Modal';

interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string | null;
  unit: string;
  packSize: string | null;
  unitPrice: number | null;
  costPrice: number | null;
  minFatPercent: number | null;
  minSnfPercent: number | null;
  shelfLifeDays: number | null;
  storageTempMin: number | null;
  storageTempMax: number | null;
  requiresColdChain: number;
  currentStock: number | null;
  reorderLevel: number | null;
  minOrderQuantity: number | null;
  priceHistory: any[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'MILK',
    subCategory: '',
    unit: 'LITRE',
    packSize: '',
    unitPrice: '',
    costPrice: '',
    minFatPercent: '',
    minSnfPercent: '',
    shelfLifeDays: '',
    storageTempMin: '',
    storageTempMax: '',
    requiresColdChain: false,
    currentStock: '',
    reorderLevel: '',
    minOrderQuantity: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load products');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        subCategory: product.subCategory || '',
        unit: product.unit,
        packSize: product.packSize || '',
        unitPrice: product.unitPrice?.toString() || '',
        costPrice: product.costPrice?.toString() || '',
        minFatPercent: product.minFatPercent?.toString() || '',
        minSnfPercent: product.minSnfPercent?.toString() || '',
        shelfLifeDays: product.shelfLifeDays?.toString() || '',
        storageTempMin: product.storageTempMin?.toString() || '',
        storageTempMax: product.storageTempMax?.toString() || '',
        requiresColdChain: product.requiresColdChain === 1,
        currentStock: product.currentStock?.toString() || '',
        reorderLevel: product.reorderLevel?.toString() || '',
        minOrderQuantity: product.minOrderQuantity?.toString() || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: 'MILK',
        subCategory: '',
        unit: 'LITRE',
        packSize: '',
        unitPrice: '',
        costPrice: '',
        minFatPercent: '',
        minSnfPercent: '',
        shelfLifeDays: '',
        storageTempMin: '',
        storageTempMax: '',
        requiresColdChain: false,
        currentStock: '',
        reorderLevel: '',
        minOrderQuantity: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          subCategory: formData.subCategory || null,
          unit: formData.unit,
          packSize: formData.packSize || null,
          unitPrice: formData.unitPrice ? parseFloat(formData.unitPrice) : null,
          costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
          minFatPercent: formData.minFatPercent ? parseFloat(formData.minFatPercent) : null,
          minSnfPercent: formData.minSnfPercent ? parseFloat(formData.minSnfPercent) : null,
          shelfLifeDays: formData.shelfLifeDays ? parseInt(formData.shelfLifeDays) : null,
          storageTempMin: formData.storageTempMin ? parseFloat(formData.storageTempMin) : null,
          storageTempMax: formData.storageTempMax ? parseFloat(formData.storageTempMax) : null,
          requiresColdChain: formData.requiresColdChain,
          currentStock: formData.currentStock ? parseFloat(formData.currentStock) : null,
          reorderLevel: formData.reorderLevel ? parseFloat(formData.reorderLevel) : null,
          minOrderQuantity: formData.minOrderQuantity ? parseFloat(formData.minOrderQuantity) : null,
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save product');
      }
    } catch (err) {
      alert('Error saving product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-lg text-zinc-600">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-semibold text-black mb-4">
                Products
              </h1>
              <p className="text-lg text-zinc-600">
                Manage your product catalog
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              + Add Product
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-black/8 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold text-black">
                  {product.name}
                </h3>
                <button
                  onClick={() => handleOpenModal(product)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Category:</span>
                  <span className="text-black font-medium">
                    {product.category}
                    {product.subCategory && ` / ${product.subCategory}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Unit:</span>
                  <span className="text-black font-medium">
                    {product.unit}
                  </span>
                </div>
                {product.unitPrice && (
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Price:</span>
                    <span className="text-black font-medium">
                      ₹{product.unitPrice.toFixed(2)}
                    </span>
                  </div>
                )}
                {product.packSize && (
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Pack Size:</span>
                    <span className="text-black font-medium">
                      {product.packSize}
                    </span>
                  </div>
                )}
                {product.requiresColdChain && (
                  <div className="mt-3 pt-3 border-t border-zinc-200">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      Cold Chain Required
                    </span>
                  </div>
                )}
                {product.storageTempMin !== null && product.storageTempMax !== null && (
                  <div className="flex justify-between mt-2">
                    <span className="text-zinc-600">Storage:</span>
                    <span className="text-black font-medium">
                      {product.storageTempMin}°C - {product.storageTempMax}°C
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {products.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-zinc-600">No products found</p>
          </motion.div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="MILK">Milk</option>
                <option value="CURD">Curd</option>
                <option value="BUTTER">Butter</option>
                <option value="CHEESE">Cheese</option>
                <option value="GHEE">Ghee</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub Category
              </label>
              <input
                type="text"
                value={formData.subCategory}
                onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit *
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="LITRE">Litre</option>
                <option value="KG">Kilogram</option>
                <option value="PIECE">Piece</option>
                <option value="PACK">Pack</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pack Size
              </label>
              <input
                type="text"
                value={formData.packSize}
                onChange={(e) => setFormData({ ...formData, packSize: e.target.value })}
                placeholder="e.g., 200 ml, 1 L"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Fat % (for milk products)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.minFatPercent}
                onChange={(e) => setFormData({ ...formData, minFatPercent: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min SNF % (for milk products)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.minSnfPercent}
                onChange={(e) => setFormData({ ...formData, minSnfPercent: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shelf Life (Days)
              </label>
              <input
                type="number"
                value={formData.shelfLifeDays}
                onChange={(e) => setFormData({ ...formData, shelfLifeDays: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Storage Temp Min (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.storageTempMin}
                onChange={(e) => setFormData({ ...formData, storageTempMin: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Storage Temp Max (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.storageTempMax}
                onChange={(e) => setFormData({ ...formData, storageTempMax: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Stock
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.currentStock}
                onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reorder Level
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Order Quantity
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.minOrderQuantity}
                onChange={(e) => setFormData({ ...formData, minOrderQuantity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="requiresColdChain"
              checked={formData.requiresColdChain}
              onChange={(e) => setFormData({ ...formData, requiresColdChain: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="requiresColdChain" className="text-sm font-medium text-gray-700">
              Requires Cold Chain
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}



