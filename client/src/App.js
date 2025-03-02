import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Cart from './components/Cart';
import ProductDetail from './components/ProductDetail';
import SearchResults from './components/SearchResults';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle search
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`http://localhost:5000/api/products/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data);
      setIsSearching(false);
    } catch (error) {
      console.error('Search error:', error);
      setError(error.message);
      setIsSearching(false);
    }
  };

  // Clear search results and show all products
  const handleClearSearch = () => {
    setSearchResults(null);
  };

  // Add product to cart
  const addToCart = (product) => {
    // Check if the product is in stock
    if (product.stock <= 0) return;

    const existingProduct = cart.find(item => item._id === product._id);
    if (existingProduct) {
      // Make sure we don't add more than available in stock
      const newQuantity = existingProduct.quantity + (product.quantity || 1);
      const finalQuantity = Math.min(newQuantity, product.stock);
      
      setCart(
        cart.map(item =>
          item._id === product._id
            ? { ...item, quantity: finalQuantity }
            : item
        )
      );
    } else {
      // Add product with quantity (default to 1 if not specified)
      const quantityToAdd = Math.min(product.quantity || 1, product.stock);
      setCart([...cart, { ...product, quantity: quantityToAdd }]);
    }
  };

  // Remove product from cart
  const removeFromCart = (id) => {
    const existingProduct = cart.find(item => item._id === id);
    if (existingProduct.quantity === 1) {
      setCart(cart.filter(item => item._id !== id));
    } else {
      setCart(
        cart.map(item =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    }
  };

  // Clear the cart
  const clearCart = () => {
    setCart([]);
  };

  // Place order
  const placeOrder = () => {
    alert('Order has been placed successfully!');
    clearCart();
  };

  // The products to display (either search results or all products)
  const displayProducts = searchResults || products;

  return (
    <Router>
      <div className="App">
        <Header 
          cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
          onSearch={handleSearch}
        />
        <main className="container mx-auto px-4 py-8">
          {searchResults && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Search Results: {searchResults.length} {searchResults.length === 1 ? 'product' : 'products'} found
                </h2>
                <button
                  onClick={handleClearSearch}
                  className="text-blue-500 hover:text-blue-700 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear Search
                </button>
              </div>
            </div>
          )}
          
          {isSearching ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    products={displayProducts}
                    loading={loading}
                    error={error}
                    addToCart={addToCart}
                  />
                }
              />
              <Route
                path="/cart"
                element={
                  <Cart
                    cartItems={cart}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                    clearCart={clearCart}
                    placeOrder={placeOrder}
                  />
                }
              />
              <Route
                path="/product/:id"
                element={
                  <ProductDetail
                    addToCart={addToCart}
                  />
                }
              />
              <Route
                path="/search-results"
                element={
                  <SearchResults
                    addToCart={addToCart}
                  />
                }
              />
            </Routes>
          )}
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
