const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Get all products
router.get('/', productController.getProducts);

// Get all specifications
router.get('/specifications', productController.getAllSpecifications);

// Search products by specification (Lucene)
router.get('/specification-search', productController.searchBySpecification);

// Regular search products
router.get('/search', productController.searchProducts);

// Get search suggestions for predictive search
router.get('/suggestions', productController.getSearchSuggestions);

// Get products by category
router.get('/category/:category', productController.getProductsByCategory);

// Get a single product
router.get('/:id', productController.getProductById);

// Create a new product
router.post('/', productController.createProduct);

// Update a product
router.put('/:id', productController.updateProduct);

// Delete a product
router.delete('/:id', productController.deleteProduct);

module.exports = router;