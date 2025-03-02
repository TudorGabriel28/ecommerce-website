import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

const Home = ({ products, loading, error, addToCart }) => {
  const [specQuery, setSpecQuery] = useState('');
  const navigate = useNavigate();

  // Group products by category
  const productsByCategory = useMemo(() => {
    return products.reduce((acc, product) => {
      const { category } = product;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
  }, [products]);

  const handleSpecSearch = (e) => {
    e.preventDefault();
    if (specQuery.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(specQuery)}`);
      setSpecQuery('');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <h2 className="text-xl font-bold">Error loading products</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome to TechShop</h1>
        
        {/* Advanced Search Box */}
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Advanced Specification Search</h2>
          <p className="text-gray-600 mb-4">
            Search for products by their specific features (e.g., "resolution 1920x1080", "storage 512GB")
          </p>
          <form onSubmit={handleSpecSearch} className="flex gap-2">
            <input
              type="text"
              value={specQuery}
              onChange={(e) => setSpecQuery(e.target.value)}
              placeholder="Enter specification (e.g., resolution 1920x1080)"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>
      
      {Object.keys(productsByCategory).length === 0 ? (
        <div className="text-center">
          <p>No products available at this moment.</p>
        </div>
      ) : (
        Object.entries(productsByCategory).map(([category, categoryProducts]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-blue-200">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categoryProducts.map(product => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  addToCart={addToCart} 
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;