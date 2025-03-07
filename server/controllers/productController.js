const Product = require('../models/Product');
const searchService = require('../services/searchService');

let searchIndexInitialized = false;
const initializeSearchIndex = async () => {
  if (!searchIndexInitialized) {
    const products = await Product.find();
    searchService.indexProducts(products);
    searchIndexInitialized = true;
  }
};

  exports.getAllSpecifications = async (req, res) => {
    try {
      const specifications = await Product.aggregate([
                { $project: { specifications: { $objectToArray: "$specifications" } } },
        { $unwind: "$specifications" },
        
                {
          $group: {
            _id: "$specifications.k",
            values: { $addToSet: "$specifications.v" }
          }
        },
        
                {
          $project: {
            _id: 0,
            key: "$_id",
            values: 1
        }
      },
      
            { $sort: { key: 1 } }
    ]);

        const formattedSpecs = specifications.reduce((acc, spec) => {
      acc[spec.key] = spec.values;
      return acc;
    }, {});

    res.json(formattedSpecs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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

exports.searchBySpecification = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.json([]);
    }

    await initializeSearchIndex();
    
    const products = await Product.find();
    
    const results = searchService.searchBySpecification(query, products);
    
    const sortOrder = req.query.sort || 'desc';
    results.sort((a, b) => {
      return sortOrder === 'desc' ? b._score - a._score : a._score - b._score;
    });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};