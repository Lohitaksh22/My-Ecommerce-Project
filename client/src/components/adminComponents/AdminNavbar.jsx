import React, { useState } from "react"
import useInterceptors from "../../hooks/useInterceptors"
import { useNavigate } from "react-router-dom"
import { HiOutlineX, HiOutlineMenu } from "react-icons/hi"

const AdminNavbar = () => {
  const api = useInterceptors()
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const [productIsOpen, setProductIsOpen] = useState(false) 

  const logOut = async () => {
    try {
      await api.post("http://localhost:3500/account/logout")
      setIsOpen(false)
      navigate("/login")
    } catch (err) {
      console.error(err)
    }
  }

  const goTo = (path) => {
    setIsOpen(false)
    navigate(path)
  }

  return (
    <>
      
      <header className="flex justify-end bg-[#0A1A2F] text-white shadow-2xl px-6 py-3 fixed top-0 w-full h-20 z-50">
        <button
          onClick={() => setIsOpen((isOpen) => !isOpen)}
          className="p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          {isOpen ? <HiOutlineX size={26} /> : <HiOutlineMenu size={26} />}
        </button>
      </header>

      
      {isOpen && (
        <div
          className="fixed inset-0 z-50  backdrop-blur-sm flex items-start justify-center p-4 sm:p-8"
          onClick={() => setIsOpen(false)} 
        >
          <nav
            className="w-full max-w-md bg-[#0A1A2F] text-white rounded-lg shadow-2xl p-6 overflow-auto"
           onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Admin Menu</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <HiOutlineX size={22} />
              </button>
            </div>

            <ul className="flex flex-col space-y-3">
              <li>
                <button
                  onClick={() => goTo("/admin")}
                  className="w-full text-left font-medium py-2 px-3 rounded hover:bg-white/5"
                >
                  Accounts
                </button>
              </li>

         
              <li>
                <div className="flex flex-col">
                  <button
                    onClick={() => setProductIsOpen((s) => !s)}
                    className="w-full text-left font-medium py-2 px-3 rounded hover:bg-white/5 flex items-center justify-between"
                  >
                    <span>Product Listings</span>
                    <span className="text-sm opacity-80">{productIsOpen ? "−" : "+"}</span>
                  </button>

                  {productIsOpen && (
                    <div className="mt-2 ml-4 flex flex-col space-y-2">
                      <button
                        onClick={() => goTo("/admin/CreateListing")}
                        className="text-sm text-left py-2 px-3 rounded hover:bg-white/5"
                      >
                        Create Product Listing
                      </button>
                      <button
                        onClick={() => goTo("/admin/Products")}
                        className="text-sm text-left py-2 px-3 rounded hover:bg-white/5"
                      >
                        See Product Listings
                      </button>
                    </div>
                  )}
                </div>
              </li>

        
              <li>
                <button
                  onClick={() => goTo("/admin/Orders")}
                  className="w-full text-left font-medium py-2 px-3 rounded hover:bg-white/5"
                >
                  Orders
                </button>
              </li>

              <li>
                <button
                  onClick={() => goTo("/admin/Reviews")}
                  className="w-full text-left font-medium py-2 px-3 rounded hover:bg-white/5"
                >
                  Reviews
                </button>
              </li>

              <hr className="border-gray-700 my-2" />

              
              <li>
                <button
                  onClick={() => goTo("/home")}
                  className="w-full text-left font-medium py-2 px-3 rounded hover:bg-white/5"
                >
                  Ecommerce
                </button>
              </li>

              <li>
                <button
                  onClick={() => goTo("/admin/Account")}
                  className="w-full text-left font-medium py-2 px-3 rounded hover:bg-white/5"
                >
                  Account
                </button>
              </li>

              <li>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    logOut()
                  }}
                  className="w-full text-left font-medium py-2 px-3 rounded hover:bg-red-600 hover:text-white transition"
                >
                  Log Out
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  )
}

export default AdminNavbar
