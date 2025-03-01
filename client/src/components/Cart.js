import React from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ cartItems, addToCart, removeFromCart, clearCart, placeOrder }) => {
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="mb-6">Looks like you haven't added any products to your cart yet.</p>
        <Link to="/" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 pb-2 border-b">Your Shopping Cart</h1>
      
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item._id} className="flex items-center bg-white p-4 rounded-lg shadow">
            <div className="w-20 h-20 flex-shrink-0 mr-4">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover rounded"
              />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
            </div>
            
            <div className="flex items-center">
              <button 
                onClick={() => removeFromCart(item._id)}
                className="bg-gray-200 px-3 py-1 rounded-l"
              >
                -
              </button>
              <span className="bg-gray-100 px-4 py-1">{item.quantity}</span>
              <button 
                onClick={() => addToCart(item)}
                className="bg-gray-200 px-3 py-1 rounded-r"
              >
                +
              </button>
            </div>
            
            <div className="ml-6 text-right">
              <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center border-b pb-4">
          <span className="text-lg">Total:</span>
          <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="mt-6 flex justify-between">
          <button 
            onClick={clearCart}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear Cart
          </button>
          <button 
            onClick={placeOrder}
            className="bg-green-500 text-white px-8 py-2 rounded hover:bg-green-600"
          >
            Place Order
          </button>
        </div>
      </div>
      
      <div className="mt-6">
        <Link to="/" className="text-blue-500 hover:underline">
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Cart;