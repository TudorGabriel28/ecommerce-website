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
    stock: 25,
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
    stock: 15,
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
    stock: 10,
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
    stock: 8,
    category: "Laptops",
    image: "https://cdn.pixabay.com/photo/2020/06/26/12/21/macbook-pro-5342546_1280.png",
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
    stock: 30,
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
    stock: 0,
    category: "Audio",
    image: "https://s13emagst.akamaized.net/products/60453/60452176/images/res_391df89bcb38fcb051a48ba6877d78dc.jpg?width=720&height=720&hash=D961A1AD22B0969EFE0A134B8AE3185B",
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
    stock: 5,
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
    stock: 3,
    category: "TVs",
    image: "https://images.samsung.com/is/image/samsung/p6pim/ro/qe55s90daexxh/gallery/ro-oled-s90d-505993-qe55s90daexxh-541983387?$684_547_PNG$",
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
    stock: 2,
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
    stock: 0,
    category: "Gaming",
    image: "https://lcdn.altex.ro/media/catalog/product/c/o/consola_playstation_5_slim_digital_edition_ps5_3_e11cd5fd.png",
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
    stock: 7,
    category: "Gaming",
    image: "https://lcdn.mediagalaxy.ro/media/catalog/product/C/o/Consola-Xbox-Series-S-Coperta.jpg",
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
    stock: 12,
    category: "Wearables",
    image: "https://s13emagst.akamaized.net/products/60441/60440994/images/res_921cde12efc92b8c725d4e3c6b95a2de.jpg?width=720&height=720&hash=3472908F98B4FD53DF07317F161912DB",
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