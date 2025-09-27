import React from 'react'
import { useRef, useEffect, useState } from 'react'
import useInterceptors from '../hooks/useInterceptors'
import { useSearchParams, useNavigate } from 'react-router-dom'

const Success = () => {
  const api = useInterceptors()
  const navigate = useNavigate()
  const [searchParam] = useSearchParams()
  const sessionId = searchParam.get("session_id")
  const [order, setOrder] = useState({ products: [] })
  const sessionIdRef = useRef(false)
  const [isLoading, setIsLoading] = useState(false)

  const createOrder = async () => {
    try {
      setIsLoading(true)
      const res1 = await api.get(`/checkout-session?sessionId=${sessionId}`)
      const res = await api.post('/orders/', {
        sessionId: sessionId,
        shippingAddress: res1.data.metadata.shippingAddress,
        deliveryTime: res1.data.metadata.deliveryTime
      })

      setOrder(res.data.Order)



    } catch (err) {
      console.log(err)

    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (sessionId && !sessionIdRef.current) {
      sessionIdRef.current = true
      createOrder()
    }
  }, [sessionId])


  return (
    <div className=' flex justify-center min-h-screen bg-linear-45 from-blue-500 to-purple-500'>
      <div className='flex flex-col items-center mt-10 p-4' >

        <h1 className='font-extrabold text-white text-5xl cursor-pointer hover:scale-105'>Order Success 🎉</h1>

        <div className='flex flex-col space-y-4 bg-white w-auto min-w-150 min-h-100 h-auto mt-10 p-6 rounded-lg shadow-2xl'>
          {isLoading ?

            <div className="flex justify-center min-h-100 items-center">
              <div className= "w-32 h-32 border-4 border-blue-500 border-dashed rounded-full animate-spin [animation-duration:3s]"></div>
            </div>


            :


            <>
              <p className='font-bold cursor-pointer hover:opacity-80'> Tracking Number: {order.trackingNumber}</p>
              <p className='font-bold bg-gradient-to-r from-green-500 via-blue-500 to-blue-500 bg-clip-text text-transparent cursor-pointer hover:opacity-80'> Paid Amount : ${order.price}</p>
              <p className='font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent cursor-pointer hover:opacity-80'>Shipping to: {order.shippingAddress}</p>
              <p className='font-bold bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent cursor-pointer hover:opacity-80'>
                Delivery Time: {new Date(order.deliveryTime).toLocaleDateString()}
              </p>

              <div className="flex flex-col space-y-6">
                {order.products.length > 0 ? (
                  order.products.map(item => (
                    <div key={item.productId} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-xl hover:scale-95 cursor-pointer">
                      <div className="flex items-center space-x-8">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                        <p className="font-medium">{item.name}</p>
                      </div>
                      <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                        <p className="font-semibold">{item.quantity} item{item.quantity > 1 ? 's' : ''} for</p>
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 font-medium">No products in this order.</p>
                )}
              </div>

              <div className='flex items-center justify-center m-4 space-x-4'>
                <button className='bg-purple-500 text-white px-4 py-2 rounded-3xl font-semibold hover:opacity-75 active:scale-95 cursor-pointer' onClick={() => navigate("/home")}>Go to Home</button>
                <button className='bg-blue-500 text-white px-4 py-2 rounded-3xl font-semibold hover:opacity-75 active:scale-95 cursor-pointer' onClick={() => navigate("/orders")}>View My Orders</button>
              </div>
            </>

          }

        </div>
      </div>

    </div>
  )
}

export default Success
