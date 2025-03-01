const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

// Sample product data
const products = [
  {
    name: "Samsung Galaxy S21",
    description: "Flagship smartphone with stunning camera capabilities and powerful performance",
    price: 799.99,
    category: "Smartphones",
    image: "https://cdn.pixabay.com/photo/2016/03/27/19/43/smartphone-1283938_1280.jpg",
    specifications: {
      display: "6.2-inch Dynamic AMOLED 2X",
      processor: "Exynos 2100/Snapdragon 888",
      camera: "64MP main + 12MP ultrawide + 12MP telephoto",
      battery: "4000mAh",
      ram: "8GB",
      storage: "128GB"
    }
  },
  {
    name: "iPhone 13 Pro",
    description: "Apple's premium smartphone with advanced camera system and A15 Bionic chip",
    price: 999.99,
    category: "Smartphones",
    image: "https://cdn.pixabay.com/photo/2020/11/22/11/53/iphone-12-5766344_1280.jpg",
    specifications: {
      display: "6.1-inch Super Retina XDR",
      processor: "A15 Bionic",
      camera: "12MP main + 12MP ultrawide + 12MP telephoto",
      battery: "3095mAh",
      ram: "6GB",
      storage: "256GB"
    }
  },
  {
    name: "Dell XPS 13",
    description: "Ultra-thin laptop with edge-to-edge display and premium build quality",
    price: 1299.99,
    category: "Laptops",
    image: "https://cdn.pixabay.com/photo/2016/03/27/07/12/apple-1282241_1280.jpg",
    specifications: {
      display: "13.4-inch 4K UHD",
      processor: "Intel Core i7-1185G7",
      gpu: "Intel Iris Xe Graphics",
      ram: "16GB",
      storage: "512GB SSD",
      resolution: "3840x2400"
    }
  },
  {
    name: "MacBook Pro M1",
    description: "Powerful laptop with Apple's M1 chip and exceptional battery life",
    price: 1299.99,
    category: "Laptops",
    image: "https://cdn.pixabay.com/photo/2016/10/15/13/40/laptop-1742435_1280.jpg",
    specifications: {
      display: "13.3-inch Retina",
      processor: "Apple M1",
      gpu: "8-core GPU",
      ram: "16GB",
      storage: "512GB SSD",
      resolution: "2560x1600"
    }
  },
  {
    name: "Sony WH-1000XM4",
    description: "Industry-leading noise cancelling wireless headphones with exceptional sound quality",
    price: 349.99,
    category: "Audio",
    image: "https://cdn.pixabay.com/photo/2018/09/17/14/27/headphones-3683983_1280.jpg",
    specifications: {
      type: "Over-ear",
      wireless: "Yes",
      batteryLife: "30 hours",
      noiseCancelling: "Active",
      connectivity: "Bluetooth 5.0"
    }
  },
  {
    name: "Apple AirPods Pro",
    description: "Wireless earbuds with active noise cancellation and customizable fit",
    price: 249.99,
    category: "Audio",
    image: "https://cdn.pixabay.com/photo/2020/12/18/16/56/laptop-5842509_1280.jpg",
    specifications: {
      type: "In-ear",
      wireless: "Yes",
      batteryLife: "4.5 hours (24 hours with case)",
      noiseCancelling: "Active",
      connectivity: "Bluetooth 5.0"
    }
  },
  {
    name: "Samsung 65\" QLED 4K Smart TV",
    description: "Premium 4K TV with quantum dot technology for vibrant colors",
    price: 1299.99,
    category: "TVs",
    image: "https://cdn.pixabay.com/photo/2015/02/07/20/58/tv-627876_1280.jpg",
    specifications: {
      display: "65-inch QLED",
      resolution: "3840x2160",
      refreshRate: "120Hz",
      smartFeatures: "Tizen OS",
      connections: "4 HDMI, 2 USB"
    }
  },
  {
    name: "LG 55\" OLED C1 Series",
    description: "OLED TV with perfect blacks and wide viewing angles",
    price: 1499.99,
    category: "TVs",
    image: "https://cdn.pixabay.com/photo/2019/08/11/23/04/tv-4399302_1280.jpg",
    specifications: {
      display: "55-inch OLED",
      resolution: "3840x2160",
      refreshRate: "120Hz",
      smartFeatures: "webOS",
      connections: "4 HDMI 2.1, 3 USB"
    }
  },
  {
    name: "Canon EOS R5",
    description: "Full-frame mirrorless camera with 8K video recording",
    price: 3899.99,
    category: "Cameras",
    image: "https://cdn.pixabay.com/photo/2018/01/28/21/14/lens-3114729_1280.jpg",
    specifications: {
      sensorType: "Full-frame CMOS",
      resolution: "45MP",
      video: "8K 30fps",
      autofocus: "Dual Pixel CMOS AF II",
      stabilization: "5-axis in-body"
    }
  },
  {
    name: "Sony PlayStation 5",
    description: "Next-generation gaming console with lightning-fast loading times",
    price: 499.99,
    category: "Gaming",
    image: "https://cdn.pixabay.com/photo/2021/09/07/08/56/console-6603120_1280.jpg",
    specifications: {
      cpu: "AMD Zen 2 (8 cores)",
      gpu: "AMD RDNA 2",
      storage: "825GB SSD",
      resolution: "4K 120fps",
      rayTracing: "Yes"
    }
  },
  {
    name: "Xbox Series X",
    description: "Microsoft's most powerful console with impressive 4K gaming capabilities",
    price: 499.99,
    category: "Gaming",
    image: "https://cdn.pixabay.com/photo/2016/11/20/21/16/repaired-1843903_1280.jpg",
    specifications: {
      cpu: "AMD Zen 2 (8 cores)",
      gpu: "12 TFLOPS, 52 CUs",
      storage: "1TB SSD",
      resolution: "4K 120fps",
      rayTracing: "Yes"
    }
  },
  {
    name: "Apple Watch Series 7",
    description: "Advanced smartwatch with larger display and faster charging",
    price: 399.99,
    category: "Wearables",
    image: "https://cdn.pixabay.com/photo/2015/07/31/11/42/apple-869353_1280.jpg",
    specifications: {
      display: "41mm/45mm Always-On Retina",
      battery: "18 hours",
      waterResistance: "50m",
      sensors: "Heart rate, ECG, Blood Oxygen",
      connectivity: "Bluetooth 5.0, Wi-Fi, Optional Cellular"
    }
  }
];

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert new products
    const insertedProducts = await Product.insertMany(products);
    console.log(`${insertedProducts.length} products inserted`);

    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });