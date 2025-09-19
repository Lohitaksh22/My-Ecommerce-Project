import React, { useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import { api } from '../api'
import { useNavigate } from 'react-router-dom'


const ProductCard = ({ _id, name, price, image }) => {
  const [quantity, setQuantity] = useState(1)
  const navigate = useNavigate()

  const addToCart = async () => {
    try {
      await api.put('/cart', {
        product: _id,
        newquantity: quantity
      })
      
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center shadow-lg w-64 h-[400px] bg-gray-100 mb-10">
      <img onClick={() => navigate(`/product/${_id}`)} src={image} className="w-48 h-48 object-cover rounded-lg active:translate-x-1 active:translate-y-1 active:shadow-inner" alt={name} />

      <div className="text-center mt-2">
        <h2 onClick={() => navigate(`/product/${_id}`)} className="text-lg font-semibold line-clamp-2">{name}</h2>
        <h2 className="text-gray-700 mt-1">${price}</h2>
      </div>


      <div className="flex space-x-4 mt-4 items-center">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition cursor-pointer"
          >
            -
          </button>
          <span className="text-lg font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity(q => q + 1)}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition cursor-pointer"
          >
            +
          </button>
        </div>

        <button
          onClick={addToCart}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer active:scale-95"
        >
          <FaShoppingCart /> Add
        </button>
      </div>
    </div>
  )
}

export default ProductCard
