import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Cart from './components/Cart';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Add product to cart
  const addToCart = (product) => {
    const existingProduct = cart.find(item => item._id === product._id);
    if (existingProduct) {
      setCart(
        cart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
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

  return (
    <Router>
      <div className="App">
        <Header cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  products={products} 
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
