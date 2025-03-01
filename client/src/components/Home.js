import React, { useMemo } from 'react';
import ProductCard from './ProductCard';

const Home = ({ products, loading, error, addToCart }) => {
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
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to TechShop</h1>
      
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