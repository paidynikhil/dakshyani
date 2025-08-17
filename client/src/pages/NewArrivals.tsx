import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Sparkles, IndianRupee, Loader2 } from 'lucide-react';
import { NewArrival } from '../types';
import api from "../components/services/api.ts";

// global server variable
const server = import.meta.env.VITE_API_BASE_URL;

const NewArrivals: React.FC = () => {
  const [newArrivals, setNewArrivals] = useState<NewArrival[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchNewArrivals = async () => {
    setLoading(true);
    try {
      const params: any = { limit: 20 };
      if (searchTerm) params.search = searchTerm;
      if (filterCategory) params.category = filterCategory;
      
      const res = await api.get(`${server}/v1/admin/new-arrival`, { params });
      setNewArrivals(res.data.data);
      setTotalProducts(res.data.total);
    } catch (err) {
      console.error('Error fetching new arrivals:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNewArrivals();
  }, [searchTerm, filterCategory]);

  const ProductCard = ({ product }: { product: NewArrival }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden">
      <div className="relative">
        <img 
          src={product.image ? `${server}${product.image}` : 'https://images.pexels.com/photos/5709703/pexels-photo-5709703.jpeg?auto=compress&cs=tinysrgb&w=400'} 
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 space-y-1">
          {product.discount && product.discount > 0 && (
            <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium block">
              {product.discount}% OFF
            </span>
          )}
          <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <Sparkles size={12} />
            <span>New</span>
          </span>
          {product.isTrending && (
            <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium block">
              Trending
            </span>
          )}
        </div>
        <div className="absolute top-2 left-2">
          <span className="bg-white/90 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
            {product.daysAgo} days ago
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">{product.title}</h3>
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
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="bg-gray-100 px-2 py-1 rounded-full">{product.category}</span>
          {product.color && <span className="bg-gray-100 px-2 py-1 rounded-full">{product.color}</span>}
          <span className={`px-2 py-1 rounded-full ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">
            Added: {new Date(product.createdAt || product.dateAdded).toLocaleDateString()}
          </span>
          {product.occasion && (
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">{product.occasion}</span>
          )}
        </div>
        
        {product.brand && (
          <div className="mt-2 text-xs text-gray-600">
            <span className="font-medium">Brand:</span> {product.brand}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <span>New Arrivals</span>
            <Sparkles className="text-red-600" size={32} />
          </h1>
          <p className="text-gray-600 mt-1">Latest additions to your collection (Last 30 days)</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search new arrivals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white transition-colors"
              >
                <option value="">All Categories</option>
                <option value="sarees">Sarees</option>
                <option value="lehengas">Lehengas</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-500">
              {loading ? 'Loading...' : `${totalProducts} products`}
            </div>
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
          {newArrivals.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}

      {!loading && newArrivals.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No new arrivals found</div>
          <p className="text-gray-500 text-sm">
            {searchTerm || filterCategory 
              ? 'Try adjusting your search or filter criteria' 
              : 'No products have been added in the last 30 days'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default NewArrivals;