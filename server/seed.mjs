import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Category from './models/Category.js'
import Product from './models/Product.js'
dotenv.config()

const categoriesData = [
  { name: "Shoes" },
  { name: "Clothing" },
  { name: "Electronics" },
  { name: "Accessories" },
  { name: "Bags" },
]

const productsData = [
  { name: "Nike Air Zoom Pegasus", price: 119.99, image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg", description: "Lightweight and breathable running shoes built for speed and comfort.", categoryName: "Shoes" },
  { name: "Adidas Ultraboost 22", price: 139.99, image: "https://images.unsplash.com/photo-1466229700857-454be534948a?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "Responsive cushioning and sleek design for everyday wear and long runs.", categoryName: "Shoes" },
  { name: "Puma Running Cap", price: 24.99, image: "https://images.unsplash.com/photo-1611891032550-cda7788e5048?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHJ1bm5pbmclMjBoYXQlMjBicmFuZCUyMHB1bWF8ZW58MHx8MHx8fDA%3D", description: "Moisture-wicking performance cap designed for sports and outdoor activities.", categoryName: "Accessories" },
  { name: "North Face Backpack", price: 89.99, image: "https://images.pexels.com/photos/30044238/pexels-photo-30044238.jpeg", description: "Durable backpack with spacious compartments, perfect for travel or school.", categoryName: "Bags" },
  { name: "Levi’s 501 Original Jeans", price: 59.99, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8amVhbnN8ZW58MHx8MHx8fDA%3D", description: "Classic straight-fit denim jeans that never go out of style.", categoryName: "Clothing" },
  { name: "Champion Hoodie", price: 49.99, image: "https://images.unsplash.com/photo-1641377060957-313a7a1e85a2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2hhbXBpb24lMjBob29kaWV8ZW58MHx8MHx8fDA%3D", description: "Cozy cotton hoodie with soft fleece interior for casual comfort.", categoryName: "Clothing" },
  { name: "Apple AirPods Pro", price: 249.99, image: "https://images.unsplash.com/photo-1659943063471-2fcc8b45edd2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGFwcGxlJTIwYWlyJTIwcG9kcyUyMHByb3xlbnwwfHwwfHx8MA%3D%3D", description: "Noise-cancelling wireless earbuds with spatial audio and long battery life.", categoryName: "Electronics" },
  { name: "Sony WH-1000XM5", price: 349.99, image: "https://images.unsplash.com/photo-1595582693131-fd8df824174a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c29ueSUyMHdofGVufDB8fDB8fHww", description: "Premium over-ear headphones with industry-leading noise cancellation.", categoryName: "Electronics" },
  { name: "Samsung Galaxy Watch 5", price: 299.99, image: "https://images.unsplash.com/photo-1553545204-4f7d339aa06a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2Ftc3VuZyUyMGdhbGF4eSUyMHdhdGNofGVufDB8fDB8fHww", description: "Smartwatch with advanced health tracking and sleek AMOLED display.", categoryName: "Electronics" },
  { name: "Ray-Ban Aviator Sunglasses", price: 159.99, image: "https://images.unsplash.com/photo-1732139637065-1088495050db?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmF5YmFuJTIwc3VuZ2xhc3Nlc3xlbnwwfHwwfHx8MA%3D%3D", description: "Iconic aviator style with UV protection and durable frames.", categoryName: "Accessories" },
  { name: "Fossil Leather Wallet", price: 49.99, image: "https://images.unsplash.com/photo-1620109176813-e91290f6c795?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9zc2lsJTIwd2FsbGV0JTIwYnJhbmR8ZW58MHx8MHx8fDA%3D", description: "Minimalist leather wallet with multiple card slots and a slim profile.", categoryName: "Accessories" },
  { name: "Nike Dri-Fit T-Shirt", price: 29.99, image: "https://images.unsplash.com/photo-1742272108714-9ef3c24b4b3f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmlrZSUyMGRyaSUyMGZpdCUyMHQlMjBzaGlydHxlbnwwfHwwfHx8MA%3D%3D", description: "Moisture-wicking performance tee ideal for workouts and casual wear.", categoryName: "Clothing" },
  { name: "Herschel Duffel Bag", price: 79.99, image: "https://plus.unsplash.com/premium_photo-1679314407939-858a78e9e1ac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGVyc2hjZWwlMjBkdWZmZWxsJTIwYmFnfGVufDB8fDB8fHww", description: "Spacious duffel bag with minimalist design, great for gym or weekend trips.", categoryName: "Bags" },
  { name: "MacBook Pro 14”", price: 1999.99, image: "https://images.unsplash.com/photo-1651747137395-065bd3af97bb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWFjYm9vayUyMHByb3xlbnwwfHwwfHx8MA%3D%3D", description: "Powerful laptop with Apple M1 Pro chip, designed for professionals.", categoryName: "Electronics" },
  { name: "iPad Air", price: 599.99, image: "https://images.unsplash.com/photo-1682427286841-1f3ff788752b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aXBhZCUyMGFpcnxlbnwwfHwwfHx8MA%3D%3D", description: "Slim and lightweight tablet with stunning Retina display.", categoryName: "Electronics" },
  { name: "Canon EOS R10 Camera", price: 999.99, image: "https://images.unsplash.com/photo-1579535984712-92fffbbaa266?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2Fub24lMjBjYW1lcmF8ZW58MHx8MHx8fDA%3D", description: "Mirrorless camera with high-speed autofocus and 4K video support.", categoryName: "Electronics" }

]


const seedDB = async () => {
  try {
    await mongoose.connect(process.env.URI)

    await Category.deleteMany({})
    await Product.deleteMany({})

    const insertedCategories = await Category.insertMany(categoriesData)

    const productsWithCategory = productsData.map(p => {
      const cat = insertedCategories.find(c => c.name === p.categoryName)
      return { ...p, category: cat._id }
    })

    await Product.insertMany(productsWithCategory)

    console.log("Database seeded successfully!")
    await mongoose.connection.close()
  } catch (err) {
    console.error(err)
    mongoose.connection.close()
  }
}

seedDB()
