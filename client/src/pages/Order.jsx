import { useEffect, useState } from 'react'
import useInterceptors from '../hooks/useInterceptors'
import {FaTrash} from "react-icons/fa"


const Order = () => {
  const api = useInterceptors()
  const [orders, setOrders] = useState([])

  const getOrders = async () => {
    try {
      const res = await api.get('/orders/user')
      setOrders(res.data.orders)


    } catch (err) {
      console.error(err)

    }
  }

  useEffect(() => {
    getOrders()
  }, [])

  const cancelOrder = async (orderId) => {
    try {
      await api.patch(`/orders/${orderId}`)
      await getOrders()
    } catch (err) {
      console.error(err)

    }
  }
  
  const deleteOrder = async (orderId) => {
    try {
      await api.delete(`/orders/${orderId}`)
      setOrders(orders.filter(
        order => String(order._id) != orderId
      ))
  
    } catch (err) {
      console.error(err)

    }
  }

  return (
    <div className='min-h-screen bg-gray-100 mt-19 p-4'>
      <div className='flex flex-col space-y-4'>

        <h2 className='font-bold text-2xl'>Your Orders</h2>
        {orders?.length > 0 ? orders.map(order => (
          <div key={order._id} className='flex flex-col w-auto min-w-100 bg-white rounded-xl p-6 space-y-2 mx-8'>
            <p className='font-extrabold cursor-pointer hover:opacity-80'> Tracking Number: {order.trackingNumber}</p>
            <p className='font-bold text-yellow-500  cursor-pointer hover:opacity-80'>Order Status: {order.orderStatus}</p>
            

            {(order.orderStatus !== "shipped" && order.orderStatus !== "delivered") ? (
              <>
              <p className='font-bold text-green-500  cursor-pointer hover:opacity-80'>Payment Status: {order.paymentStatus}</p>
               <button 
              onClick={() => {cancelOrder(order._id)}}
              className='bg-red-500 w-30 px-2 py-1 rounded-2xl text-white mx-auto hover:opacity-75 active:scale-95'>Cancel</button>
              
              {order.orderStatus === "canceled" &&  <FaTrash className= "mx-auto m-2 hover:text-red-500 active:scale-105" onClick={() => {deleteOrder(order._id)}} />}
              </>

            ) : (
              <>
                <p className='font-bold bg-gradient-to-r from-green-500 via-blue-500 to-blue-500 bg-clip-text text-transparent cursor-pointer hover:opacity-80'>
                  Paid Amount : ${order.price}
                </p>
                <p className='font-bold bg-gradient-to-r from-blue-500 via-blue-500 to-blue-500 bg-clip-text text-transparent cursor-pointer hover:opacity-80'>
                  Delivery Date: {new Date(order.deliveryTime).toLocaleDateString()}
                </p>
                <p className='font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent cursor-pointer hover:opacity-80'>
                  Shipping to: {order.shippingAddress}
                </p>
              </>
            )}


            {order.products?.length > 0 ? (
              order.products.map(item => (
                <div key={item.productId} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-xl hover:scale-95">
                  <div className="flex items-center space-x-8">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                    <p className="font-medium">{item.name}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                    <p className="font-semibold">{item.quantity} unit{item.quantity > 1 ? 's' : ''} for ${(item.price * item.quantity).toFixed(2)}</p>

                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 font-medium">No products in this order.</p>
            )}
          </div>))

          : <p className='text-gray-500 mx-auto mt-5 items-center justify-center'>No Orders Made</p>}


      </div>
    </div>
  )
}

export default Order
