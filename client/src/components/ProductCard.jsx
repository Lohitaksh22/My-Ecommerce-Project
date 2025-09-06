import React from 'react'
import { FaShoppingCart } from 'react-icons/fa'

const ProductCard = () => {
  return (
    <div className="flex flex-col items-center justify-center shadow-lg w-64 h-[400px] bg-gray-100 py-32 mt-32 ml-8 space-y-2">
      <img src='/assets/download.webp' className='w-60 h-60 object-contain'></img>
      <h2 className='text-lg font-semibold hover: cursor-pointer'>MacBook Air M4</h2>
      <h2>$899</h2>
      <div className='flex space-x-4 mt-2'>
      <button className='bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-600 cursor-pointer'>Buy Now</button>
      <button><FaShoppingCart  size={25} className='hover:text-blue-700'/></button>
      </div>

    </div>

  )
}

export default ProductCard
