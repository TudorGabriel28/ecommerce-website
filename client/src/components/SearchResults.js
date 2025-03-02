import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';

const SearchResults = ({ addToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [filters, setFilters] = useState({
    category: '',
    specifications: {}
  });
  const [availableFilters, setAvailableFilters] = useState({
    categories: [],
    specifications: {}
  });

  // Extract unique filters from results
  useEffect(() => {
    if (results.length > 0) {
      const categories = [...new Set(results.map(product => product.category))];
      const specs = results.reduce((acc, product) => {
        Object.entries(product.specifications || {}).forEach(([key, value]) => {
          if (!acc[key]) acc[key] = new Set();
          acc[key].add(value);
        });
        return acc;
      }, {});

      setAvailableFilters({
        categories,
        specifications: Object.fromEntries(
          Object.entries(specs).map(([key, values]) => [key, Array.from(values)])
        )
      });
    }
  }, [results]);

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const query = searchParams.get('query') || '';
        const response = await fetch(
          `http://localhost:5000/api/products/specification-search?` + 
          `query=${encodeURIComponent(query)}&` +
          `sort=${sortOrder}`
        );
        
        if (!response.ok) throw new Error('Search failed');
        
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams, sortOrder]);

  // Apply filters to results
  const filteredResults = results.filter(product => {
    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Specifications filters
    for (const [key, value] of Object.entries(filters.specifications)) {
      if (value && product.specifications[key] !== value) {
        return false;
      }
    }

    return true;
  });

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    if (type === 'category') {
      setFilters(prev => ({ ...prev, category: value }));
    } else {
      setFilters(prev => ({
        ...prev,
        specifications: { ...prev.specifications, [type]: value }
      }));
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
        <h2 className="text-xl font-bold">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">Filters</h2>
            
            {/* Sort Order */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Sort by Relevance</h3>
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="desc">Highest Match First</option>
                <option value="asc">Lowest Match First</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Category</h3>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">All Categories</option>
                {availableFilters.categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Specification Filters */}
            {Object.entries(availableFilters.specifications).map(([spec, values]) => (
              <div key={spec} className="mb-6">
                <h3 className="font-semibold mb-2 capitalize">{spec}</h3>
                <select
                  value={filters.specifications[spec] || ''}
                  onChange={(e) => handleFilterChange(spec, e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All {spec}</option>
                  {values.map(value => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="flex-grow">
          <h1 className="text-2xl font-bold mb-6">
            Search Results ({filteredResults.length})
          </h1>
          
          {filteredResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  addToCart={addToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;