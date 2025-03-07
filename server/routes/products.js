const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);

router.get('/specifications', productController.getAllSpecifications);

router.get('/specification-search', productController.searchBySpecification);

router.get('/search', productController.searchProducts);

router.get('/suggestions', productController.getSearchSuggestions);

router.get('/category/:category', productController.getProductsByCategory);

router.get('/:id', productController.getProductById);

router.post('/', productController.createProduct);

router.put('/:id', productController.updateProduct);

router.delete('/:id', productController.deleteProduct);

module.exports = router;