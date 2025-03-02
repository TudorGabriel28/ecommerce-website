const elasticlunr = require('elasticlunr');

class SearchService {
  constructor() {
    // Initialize the index
    this.searchIndex = null;
    this.initIndex();
  }

  initIndex() {
    this.searchIndex = elasticlunr(function() {
      this.addField('name');
      this.addField('description');
      this.addField('specifications');
      this.addField('category');
      this.setRef('_id');
    });
  }

  // Initialize index with products
  indexProducts(products) {
    // Reinitialize the index
    this.initIndex();
    
    products.forEach(product => {
      // Convert specifications map to searchable string
      const specString = Object.entries(product.specifications || {})
        .map(([key, value]) => `${key}:${value}`)
        .join(' ');

      this.searchIndex.addDoc({
        _id: product._id.toString(),
        name: product.name,
        description: product.description,
        specifications: specString,
        category: product.category
      });
    });
  }

  // Search products by specification
  searchBySpecification(query, products) {
    if (!this.searchIndex) {
      this.indexProducts(products);
    }

    const searchResults = this.searchIndex.search(query, {
      fields: {
        specifications: {boost: 2},
        name: {boost: 1},
        description: {boost: 1}
      },
      expand: true // Enable fuzzy matching
    });

    // Map search results back to products with scores
    return searchResults.map(result => {
      const product = products.find(p => p._id.toString() === result.ref);
      if (!product) return null;
      
      // Convert to plain object and ensure specifications are included
      const productObj = product.toObject({ getters: true });
      
      // Convert Map to plain object if it's a Map
      if (product.specifications instanceof Map) {
        productObj.specifications = Object.fromEntries(product.specifications);
      }
      
      return {
        ...productObj,
        _score: result.score
      };
    }).filter(Boolean); // Remove any null results
  }
}

module.exports = new SearchService();