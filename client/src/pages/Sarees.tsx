import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Star, IndianRupee, X, Upload, Loader2 } from 'lucide-react';
import { SareeProduct } from '../types';
import api from "../components/services/api.ts";

// global server variable
const server = import.meta.env.VITE_API_BASE_URL;

const Sarees: React.FC = () => {
  const [sarees, setSarees] = useState<SareeProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editSaree, setEditSaree] = useState<SareeProduct | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    discount: '',
    type: '',
    color: '',
    occasion: '',
    pattern: '',
    fabric: '',
    inStock: true,
    fastDelivery: false,
    brand: '',
    image: null,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      originalPrice: '',
      discount: '',
      type: '',
      color: '',
      occasion: '',
      pattern: '',
      fabric: '',
      inStock: true,
      fastDelivery: false,
      brand: '',
      image: null,
    });
    setImagePreview(null);
  };

  const fetchSarees = async () => {
    setLoading(true);
    try {
      const params: any = { limit: 20 };
      if (searchTerm) params.search = searchTerm;
      if (filterType) params.types = filterType;
      const res = await api.get(`${server}/v1/admin/sarees`, { params });
      setSarees(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSarees();
  }, [searchTerm, filterType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const data = new FormData();
      for (const key in formData) {
        if (key === 'image' && formData[key]) {
          data.append(key, formData[key]);
        } else if (key !== 'image') {
          data.append(key, formData[key]);
        }
      }
      
      if (editSaree) {
        await api.patch(`${server}/v1/admin/sarees/${editSaree._id}`, data);
      } else {
        await api.post(`${server}/v1/admin/sarees`, data);
      }
      
      setShowAddForm(false);
      setEditSaree(null);
      resetForm();
      fetchSarees();
    } catch (err) {
      console.error(err);
    }
    setFormLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this saree?')) return;
    try {
      await api.delete(`${server}/v1/admin/sarees/${id}`);
      fetchSarees();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditForm = async (id: string) => {
    try {
      const res = await api.get(`${server}/v1/admin/sarees/${id}`);
      const sareeData = res.data.data;
      setEditSaree(sareeData);
      setFormData({
        ...sareeData,
        price: sareeData.price?.toString() || '',
        originalPrice: sareeData.originalPrice?.toString() || '',
        discount: sareeData.discount?.toString() || '',
        image: null
      });
      if (sareeData.image) {
        setImagePreview(`${server}${sareeData.image}`);
      }
      setShowAddForm(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
  };

  const handleAddNew = () => {
    resetForm();
    setEditSaree(null);
    setShowAddForm(true);
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditSaree(null);
    resetForm();
  };

  const ProductCard = ({ product }: { product: SareeProduct }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden">
      <div className="relative">
        <img 
          src={product.image ? `${server}${product.image}` : 'https://images.pexels.com/photos/5709703/pexels-photo-5709703.jpeg?auto=compress&cs=tinysrgb&w=400'} 
          alt={product.title} 
          className="w-full h-48 object-cover" 
        />
        {product.discount && product.discount > 0 && (
          <div className="absolute top-2 right-2">
            <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              {product.discount}% OFF
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">{product.title}</h3>
          <div className="flex items-center space-x-1">
            <button 
              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors" 
              onClick={() => openEditForm(product._id)}
            >
              <Edit size={16} />
            </button>
            <button 
              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors" 
              onClick={() => handleDelete(product._id)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-red-600 flex items-center">
              <IndianRupee size={16} />
              {product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through flex items-center">
                <IndianRupee size={12} />
                {product.originalPrice}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{product.rating || 0}</span>
            <span className="text-sm text-gray-400">({product.reviews || 0})</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          {product.type && <span className="bg-gray-100 px-2 py-1 rounded-full">{product.type}</span>}
          {product.color && <span className="bg-gray-100 px-2 py-1 rounded-full">{product.color}</span>}
          <span className={`px-2 py-1 rounded-full ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">{product.brand}</span>
          {product.fastDelivery && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Fast Delivery</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sarees</h1>
          <p className="text-gray-600 mt-1">Manage your saree collection</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2 shadow-sm"
        >
          <Plus size={20} />
          <span>Add Saree</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search sarees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white transition-colors"
            >
              <option value="">All Types</option>
              <option value="Silk">Silk</option>
              <option value="Cotton">Cotton</option>
              <option value="Chiffon">Chiffon</option>
              <option value="Georgette">Georgette</option>
              <option value="Crepe">Crepe</option>
              <option value="Art Silk">Art Silk</option>
              <option value="Cotton Silk">Cotton Silk</option>
              <option value="Net">Net</option>
              <option value="Satin">Satin</option>
              <option value="Organza">Organza</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">
            {loading ? 'Loading...' : `${sarees.length} products`}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-red-600" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sarees.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {!loading && sarees.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No sarees found matching your criteria</div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editSaree ? 'Edit Saree' : 'Add New Saree'}
              </h2>
              <button 
                onClick={closeForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter saree title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    required
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Enter saree description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                {/* Original Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    min="0"
                    max="100"
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <input
                    type="text"
                    placeholder="Enter brand name"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  >
                    <option value="">Select Type</option>
                    <option value="Silk">Silk</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Chiffon">Chiffon</option>
                    <option value="Georgette">Georgette</option>
                    <option value="Crepe">Crepe</option>
                    <option value="Net">Net</option>
                    <option value="Satin">Satin</option>
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  >
                    <option value="">Select Color</option>
                    <option value="Red">Red</option>
                    <option value="Blue">Blue</option>
                    <option value="Green">Green</option>
                    <option value="Yellow">Yellow</option>
                    <option value="Pink">Pink</option>
                    <option value="Purple">Purple</option>
                    <option value="Orange">Orange</option>
                    <option value="Black">Black</option>
                    <option value="White">White</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Maroon">Maroon</option>
                  </select>
                </div>

                {/* Occasion */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Occasion</label>
                  <select
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  >
                    <option value="">Select Occasion</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Festival">Festival</option>
                    <option value="Party">Party</option>
                    <option value="Casual">Casual</option>
                    <option value="Office">Office</option>
                    <option value="Traditional">Traditional</option>
                    <option value="Formal">Formal</option>
                  </select>
                </div>

                {/* Pattern */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pattern</label>
                  <select
                    value={formData.pattern}
                    onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  >
                    <option value="">Select Pattern</option>
                    <option value="Floral">Floral</option>
                    <option value="Geometric">Geometric</option>
                    <option value="Abstract">Abstract</option>
                    <option value="Traditional">Traditional</option>
                    <option value="Plain">Plain</option>
                    <option value="Embroidered">Embroidered</option>
                    <option value="Printed">Printed</option>
                    <option value="Woven">Woven</option>
                  </select>
                </div>

                {/* Fabric */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fabric</label>
                  <select
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  >
                    <option value="">Select Fabric</option>
                    <option value="Pure Silk">Pure Silk</option>
                    <option value="Art Silk">Art Silk</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Cotton Silk">Cotton Silk</option>
                    <option value="Chiffon">Chiffon</option>
                    <option value="Georgette">Georgette</option>
                    <option value="Crepe">Crepe</option>
                    <option value="Net">Net</option>
                    <option value="Satin">Satin</option>
                    <option value="Organza">Organza</option>
                  </select>
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                  <div className="space-y-4">
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-2">
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <span className="text-red-600 hover:text-red-500">Upload an image</span>
                            <input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                    {!imagePreview && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      />
                    )}
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.inStock}
                        onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">In Stock</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.fastDelivery}
                        onChange={(e) => setFormData({ ...formData, fastDelivery: e.target.checked })}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Fast Delivery</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                  disabled={formLoading}
                >
                  {formLoading && <Loader2 className="animate-spin" size={16} />}
                  <span>{editSaree ? 'Update Saree' : 'Add Saree'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sarees;