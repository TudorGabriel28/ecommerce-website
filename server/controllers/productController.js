const Product = require('../models/Product');
const searchService = require('../services/searchService');

// Initialize search index
let searchIndexInitialized = false;
const initializeSearchIndex = async () => {
  if (!searchIndexInitialized) {
    const products = await Product.find();
    searchService.indexProducts(products);
    searchIndexInitialized = true;
  }
};

// Get all specifications
  exports.getAllSpecifications = async (req, res) => {
    try {
      const specifications = await Product.aggregate([
        // Unwind specifications to create a document for each key-value pair
        { $project: { specifications: { $objectToArray: "$specifications" } } },
        { $unwind: "$specifications" },
        
        // Group by specification key and collect unique values
        {
          $group: {
            _id: "$specifications.k",
            values: { $addToSet: "$specifications.v" }
          }
        },
        
        // Format the output
        {
          $project: {
            _id: 0,
            key: "$_id",
            values: 1
        }
      },
      
      // Sort by specification key
      { $sort: { key: 1 } }
    ]);

    // Convert to object format
    const formattedSpecs = specifications.reduce((acc, spec) => {
      acc[spec.key] = spec.values;
      return acc;
    }, {});

    res.json(formattedSpecs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search products by title or description
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.json([]);
    }
    
    const products = await Product.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get suggestions for predictive search
exports.getSearchSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.json([]);
    }
    
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).limit(5).select('name');
    
    const suggestions = products.map(product => product.name);
    
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search products by specification using Lucene
exports.searchBySpecification = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.json([]);
    }

    // Initialize search index if needed
    await initializeSearchIndex();
    
    // Get all products for result mapping
    const products = await Product.find();
    
    // Perform specification search
    const results = searchService.searchBySpecification(query, products);
    
    // Sort results by score if specified
    const sortOrder = req.query.sort || 'desc';
    results.sort((a, b) => {
      return sortOrder === 'desc' ? b._score - a._score : a._score - b._score;
    });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};