import FilterOrdersAdmin from "../../components/adminComponents/FilterOrdersAdmin"
import useInterceptors from "../../hooks/useInterceptors"
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"



const AdminOrders = () => {
  const [placeholder, setPlaceholder] = useState("🔍 Search Orders...")
  const [keyword, setKeyword] = useState("")
  const api = useInterceptors()
  const [searchParams] = useSearchParams()
  const [err, setErr] = useState("")
  const [msg, setMsg] = useState("")
  const [orders, setOrders] = useState([])
  const [orderStatus, setOrderStatus] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("")
  const [sort, setSort] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(null)

  useEffect(() => {
    setSort(searchParams.get("sort") || "")
    setOrderStatus(searchParams.get("orderStatus") || "")
    setPaymentStatus(searchParams.get("paymentStatus") || "")
  }, [searchParams])

  const getOrders = async () => {
    try {
      const res = await api.get('/admin/allOrders', {
        params: {
          keyword,
          sort,
          orderStatus,
          paymentStatus,
          page
        }
      })
      setOrders(res.data.allOrders)
      setMsg(res.data.msg)
      setTotalPages(res.data.pages)
      setErr("")
    } catch (err) {
      console.error(err)
      setErr("No Orders Found")

    }
  }

  useEffect(() => {
       window.scrollTo({ top: 0, behavior: "smooth" })
    getOrders()
  }, [keyword, orderStatus, paymentStatus, sort, page])

  const handleKeyword = (value) => {
    setKeyword(value)
  }

  const arr = Array.from({length: totalPages})

  return (
    <div className="min-h-screen bg-gray-300 p-8">
      <div className="flex flex-col px-8 py-24">

        <div className="flex items-center gap-2 max-w-md w-full mx-auto">
          <FilterOrdersAdmin />
          <input type="text" className="mx-8 flex-1 max-w-sm w-full border border-gray-400 hover::placeholder-text-white focus:ring-5 focus:ring-white transition duration-300 focus:bg-[#0A1A2F] focus:text-white  flex mx-auto px-4 py-2 rounded-2xl" placeholder={placeholder}
            onFocus={() => setPlaceholder("Type to search through accounts or products...")} onBlur={() => setPlaceholder("🔍 Search Orders...")}

            onChange={(e) => {
              handleKeyword(e.target.value)
            }}
          ></input>
        </div>

        {orders?.length > 0 && !err ? (
          <div className="w-full max-w-xl mx-auto">
            {msg && (
              <p className="mt-8 mb-4 text-center text-lg font-semibold ">
                {msg} Orders Found
              </p>
            )}

            {orders.map(order => (
              <div
                key={order._id}
                className="flex flex-col bg-white rounded-xl p-6 space-y-4 shadow-lg mb-8"
              >
                <p className="font-extrabold cursor-pointer hover:opacity-80">
                  Tracking Number: {order.trackingNumber}
                </p>
                <p className="font-bold cursor-pointer hover:opacity-80">
                  User: {order.user.username}
                </p>
                <p className="font-bold text-yellow-500 cursor-pointer hover:opacity-80">
                  Order Status: {order.orderStatus}
                </p>

                <div className="space-y-2">
                  <p className="font-bold bg-gradient-to-r from-green-500 via-blue-500 to-blue-500 bg-clip-text text-transparent">
                    Paid Amount: ${order.price}
                  </p>
                  <p className="font-bold bg-gradient-to-r from-blue-500 via-blue-500 to-blue-500 bg-clip-text text-transparent">
                    Delivery Date: {new Date(order.deliveryTime).toLocaleDateString()}
                  </p>
                  <p className="font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Shipping to: {order.shippingAddress}
                  </p>
                </div>

                {order.products?.length > 0 ? (
                  order.products.map(item => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between bg-white p-4 rounded-lg shadow-xl hover:scale-95 transition-transform"
                    >
                      <div className="flex items-center space-x-6">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <p className="font-medium">{item.name}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="font-semibold">
                          {item.quantity} unit{item.quantity > 1 ? "s" : ""} for $
                          {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 font-medium">No products in this order</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-center mt-10">{err}</p>
        )}

         {totalPages && (
          <div className="flex justify-center space-x-2 mt-6">
            {arr.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`p-2 rounded-md px-4 ${page === i + 1
                    ? "bg-[#0A1A2F] text-white font-bold"
                    : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrders
