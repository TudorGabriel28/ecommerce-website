import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 0)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      // Create a new object with quantity for the cart
      const productToAdd = {
        ...product,
        quantity: quantity
      };
      addToCart(productToAdd);
      // Reset quantity after adding to cart
      setQuantity(1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center text-red-500 p-4">
        <h2 className="text-xl font-bold">Error loading product</h2>
        <p>{error || 'Product not found'}</p>
        <Link to="/" className="text-blue-500 hover:underline mt-4 block">
          Return to home page
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const specifications = product.specifications || {};

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-4">
        <Link to="/" className="text-blue-500 hover:underline">
          ← Back to Products
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2 p-6">
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-auto object-contain max-h-96 mx-auto"
              />
              {isOutOfStock && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md font-bold">
                  Out of Stock
                </div>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-md font-bold">
                  Low Stock: {product.stock} left
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="text-2xl text-blue-600 font-bold mb-4">${product.price.toFixed(2)}</div>
            <p className="text-gray-700 mb-6">{product.description}</p>

            {/* Stock status */}
            <div className="mb-6">
              {!isOutOfStock ? (
                <p className="text-green-600">
                  <span className="font-bold">In Stock:</span> {product.stock} available
                </p>
              ) : (
                <p className="text-red-600 font-bold">Currently Out of Stock</p>
              )}
            </div>

            {/* Add to Cart Section */}
            {!isOutOfStock && (
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <label htmlFor="quantity" className="block text-gray-700 mb-1">Quantity:</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="border border-gray-300 rounded-md px-3 py-2 w-16 text-center"
                  />
                </div>
                <button
                  onClick={handleAddToCart}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            )}

            {/* Product Category */}
            <div className="mb-4">
              <span className="font-semibold">Category:</span> {product.category}
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="border-t border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Specifications</h2>
          {Object.keys(specifications).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(specifications).map(([key, value]) => (
                <div key={key} className="flex">
                  <span className="font-semibold w-1/3 capitalize">{key}:</span>
                  <span className="text-gray-700 w-2/3">{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No specifications available for this product.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;