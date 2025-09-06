import React, { useState } from "react"
import { FaTrash } from "react-icons/fa"


const Cart = () => {
  
  const [cart, setCart] = useState([
    { id: 1, name: "Sneakers", price: 59.99, qty: 2, image: "/assets/OIP.webp" },
    { id: 2, name: "Headphones", price: 99.99, qty: 1, image: "/assets/OIP (1).webp" },
  ])

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const updateQty = (id, qty) => {
    if (qty < 1) return
    setCart(cart.map((item) => item.id === id ? { ...item, qty } : item))
  }

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0)

  return (
    <div className="min-h-screen bg-gray-100">
   

      <div className="max-w-5xl mx-auto p-6 mt-24">
        <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

        {cart.length === 0 ? (
          <p className="text-gray-500 flex justify-center">Your cart is empty.</p>
        ) : (
          <div className="flex flex-col space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-xl"
              >
                
                <div className="flex items-center space-x-8">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                  <p className="font-medium">{item.name}</p>
                </div>

                
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <input
                    type="number"
                    value={item.qty}
                    min="1"
                    onChange={(e) => updateQty(item.id, parseInt(e.target.value))}
                    className="w-16 border rounded text-center"
                  />
                  <p className="font-semibold">${(item.price * item.qty).toFixed(2)}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}

            
            <div className="flex justify-end mt-6">
              <div className="bg-white p-6 rounded-lg shadow-xl w-full sm:w-1/3 flex flex-col space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
