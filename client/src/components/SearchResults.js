import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

const SearchResults = ({ addToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [specQuery, setSpecQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const navigate = useNavigate();
  
  // Add state for all specifications from database
  const [allSpecifications, setAllSpecifications] = useState({});
  
  const [filters, setFilters] = useState({
    category: '',
    specifications: {}
  });

  const [availableFilters, setAvailableFilters] = useState({
    categories: [],
    specifications: {}
  });

  // Fetch all possible specifications from database
  useEffect(() => {
    const fetchSpecifications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products/specifications');
        if (!response.ok) throw new Error('Failed to fetch specifications');
        const data = await response.json();
        setAllSpecifications(data);
        console.log(data);
      } catch (err) {
        console.error('Error fetching specifications:', err);
      }
    };

    fetchSpecifications();
  }, []);

  // Handle specification search
  const handleSpecSearch = (e) => {
    e.preventDefault();
    if (specQuery.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(specQuery)}`);
      setSpecQuery('');
    }
  };

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

  // Handle specification filter changes
  const handleSpecFilterChange = (specKey, value) => {
    setFilters(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [specKey]: {
          ...(prev.specifications[specKey] || {}),
          [value]: !(prev.specifications[specKey]?.[value] || false)
        }
      }
    }));
  };

  // Apply filters to results
  const filteredResults = results.filter(product => {
    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Specifications filters
    for (const [specKey, selectedValues] of Object.entries(filters.specifications)) {
      const activeValues = Object.entries(selectedValues)
        .filter(([_, isSelected]) => isSelected)
        .map(([value]) => value);
      
      if (activeValues.length > 0) {
        const productValue = product.specifications[specKey];
        if (!activeValues.includes(productValue)) {
          return false;
        }
      }
    }

    return true;
  });

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
        <div className="w-full md:w-72 flex-shrink-0 -ml-4">
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            {/* Specification Search Box */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Search Specifications</h3>
              <form onSubmit={handleSpecSearch}>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={specQuery}
                    onChange={(e) => setSpecQuery(e.target.value)}
                    placeholder="e.g., resolution 1920x1080"
                    className="w-full p-2 border rounded"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

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
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-2 border rounded"
              >
                <option value="">All Categories</option>
                {availableFilters.categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* All Specifications Filters */}
            {Object.entries(allSpecifications).map(([spec, values]) => (
              <div key={spec} className="mb-6">
                <h3 className="font-semibold mb-2 capitalize">{spec}</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded bg-gray-50">
                  {values.map(value => (
                    <label
                      key={`${spec}-${value}`}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-white p-1 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters.specifications[spec]?.[value] || false}
                        onChange={() => handleSpecFilterChange(spec, value)}
                        className="form-checkbox h-4 w-4 text-blue-600 rounded"
                      />
                      <span className="text-sm">{value}</span>
                    </label>
                  ))}
                </div>
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
                product && product._id ? (
                  <ProductCard
                    key={product._id}
                    product={product}
                    addToCart={addToCart}
                  />
                ) : null
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;