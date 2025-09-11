import React from 'react'
import { FaShoppingCart } from 'react-icons/fa'

const ProductCard = ({name, price, image}) => {
  return (
    <div className="flex flex-col items-center justify-center shadow-lg w-64 h-[400px] bg-gray-100 mb-10 ">
      <img src= {image} className='w-48 h-48 object-cover rounded-lg'></img>
     
     <div className="text-center mt-2">
        <h2 className="text-lg font-semibold hover:cursor-pointer line-clamp-2">{name}</h2>
        <h2 className="text-gray-700 mt-1">${price}</h2>
      </div>

      <div className='flex space-x-4 mt-2'>
      <button className='bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-600 cursor-pointer'>Buy Now</button>
      <button><FaShoppingCart  size={25} className='hover:text-blue-700'/></button>
      </div>

    </div>

  )
}

export default ProductCard
