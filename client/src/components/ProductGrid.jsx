import React from 'react'
import ProductCard from './ProductCard'

const ProductGrid = () => {
  return (
    <div  className=' "min-h-screen bg-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8'>
       <ProductCard />
       <ProductCard />
       <ProductCard />
       <ProductCard />
       <ProductCard />
       </div>
  )
}

export default ProductGrid
