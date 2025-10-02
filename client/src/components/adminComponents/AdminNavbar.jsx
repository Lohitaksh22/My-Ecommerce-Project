import useInterceptors from "../../hooks/useInterceptors"
import { useNavigate } from "react-router-dom"
import { FaUser } from "react-icons/fa"
import { useState } from "react"
import { HiOutlineX } from "react-icons/hi"



const AdminNavbar = () => {
  const api = useInterceptors()
  const [profileIsOpen, setProfileIsOpen] = useState(false)
  const navigate = useNavigate()
  const [productIsOpen, setProductIsOpen] = useState(false)

  const logOut = async () => {
    try {
      await api.post("http://localhost:3500/account/logout")
      navigate('/login')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className='flex space-x-4 bg-[#0A1A2F] text-white shadow-2xl px-8 py-4 fixed top-0 w-full min-h-20 justify-between items-center z-40 '>
      <p onClick={() => navigate('/admin')} className="text-lg font-semibold cursor-pointer hover:opacity-75 active:scale-95">Accounts</p>

      <div className="relative my-auto">
        <button onClick={() => { setProductIsOpen(!productIsOpen) }}>
          {productIsOpen
            ? <HiOutlineX size={30} />
            : <p className="text-lg font-semibold cursor-pointer hover:opacity-75 active:scale-95">Product Listings</p>
}
        </button>
        <div
          className={`absolute right-1 mt-1  w-auto min-w-50 bg-gray-200 px-4 py-6 flex flex-col justify-center shadow-xl rounded transform transition-all duration-300 ease-out
              ${productIsOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
        >
          <p onClick={() => navigate('/admin/CreateListing')} className=' whitespace-nowrap overflow-hidden font-semibold text-black mt-2 cursor-pointer transform transition duration-300 hover:text-blue-500 hover:scale-95'>Create Product Listing</p>
          <p className='font-semibold mt-4 cursor-pointer transform transition text-black duration-300 hover:text-blue-500 hover:scale-95' onClick={() => navigate("admin/Products")}>See Product Listings</p>
        </div>
      </div>



      <p  onClick={() => navigate('/admin/Orders')} className="text-lg font-semibold cursor-pointer hover:opacity-75 active:scale-95">Orders</p>
      <p onClick={() => navigate('/admin/Reviews')} className="text-lg font-semibold cursor-pointer hover:opacity-75 active:scale-95">Reviews</p>

      <div className="relative my-auto">
        <button onClick={() => { setProfileIsOpen(!profileIsOpen) }}>
          {profileIsOpen
            ? <HiOutlineX size={30} />
            : <FaUser className="hover:opacity-75 text-[25px] cursor-pointer " />}
        </button>
        <div
          className={`absolute right-0  w-36 bg-gray-200 px-6 py-4 flex flex-col justify-center shadow-xl rounded transform transition-all duration-300 ease-out
              ${profileIsOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
        >
          <p onClick={() => navigate('/home')} className='font-semibold  whitespace-nowrap overflow-hidden text-black mt-4 cursor-pointer transform transition duration-300 hover:text-blue-500 hover:scale-110'>Ecommerce</p>
          <p onClick={() => navigate('/admin/Account')} className='font-semibold text-black mt-4 cursor-pointer transform transition duration-300 hover:text-blue-500 hover:scale-110'>Account</p>
          <p className='font-semibold mt-4 cursor-pointer transform transition text-black duration-300 hover:text-blue-500 hover:scale-110' onClick={(e) => {
            e.preventDefault()
            logOut()
            }}>Log Out</p>
        </div>
      </div>

    </div>
  )
}

export default AdminNavbar
