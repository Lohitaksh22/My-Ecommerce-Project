import React from 'react'
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa"
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'



const Navbar = () => {
  const [profileIsOpen, setProfileIsOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const logOut = async(e) => {
    e.preventDefault()

     try{
      await axios.post("http://localhost:3500/account/logout" , {}, { withCredentials: true })
      navigate('/login')
    }catch(err){
      console.error(err)
    }
  }

  return (
    <div className='flex bg-[#F5F5F5] shadow-xl px-8 py-4 fixed top-0 w-full justify-between items-center z-40 '>

      <p onClick={() => navigate('/')} className='flex-none text-[25px] w-32 hover:text-blue-500 cursor-pointer font-bold' >
        MyShop
      </p>

      <div className='hidden sm:flex items-center border-1 border-gray-300 rounded-lg px-2 py-2 flex-1 max-w-lg mx-4'>
        <input type='text' placeholder='Search' className=' flex-1 outline-none px-2 '></input>
        <FaSearch className=" hover:text-blue-500 text-[20px] cursor-pointer " size={20} />
      </div>

      <div className='hidden sm:flex items-center space-x-4 relative'>
        <div className="relative">
          <button onClick={() => setProfileIsOpen(!profileIsOpen)}>
            {profileIsOpen
              ? <HiOutlineX size={30} />
              : <FaUser className="hover:text-blue-500 text-[25px] cursor-pointer" />}
          </button>
          <div
            className={`absolute right-0 mt-2 w-36 bg-[#F5F5F5] px-6 py-4 flex flex-col justify-center shadow-xl rounded transform transition-all duration-300 ease-out
        ${profileIsOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
          >
            <p className='font-semibold cursor-pointer transform transition duration-300 hover:text-blue-500 hover:scale-110' onClick={() => navigate('/orders')}>Orders</p>
            <p className='font-semibold mt-4 cursor-pointer transform transition duration-300 hover:text-blue-500 hover:scale-110'>Account</p>
            <p className='font-semibold mt-4 cursor-pointer transform transition duration-300 hover:text-blue-500 hover:scale-110' onClick={logOut}>Log Out</p>
          </div>
        </div>

        <FaShoppingCart
          className="hover:text-blue-500 text-[25px] cursor-pointer"
          onClick={() => navigate('/cart')}
        />
      </div>


      <div className='sm:hidden '>
        <button onClick={() => setIsOpen(!isOpen)} className='py-2  hover:text-blue-500 cursor-pointer font-bold'>
          {isOpen ? <HiOutlineX size={30} className='absolute top-4 right-8' /> : <HiOutlineMenu size={30} />}
        </button>

        {isOpen &&
          <div className='sm:hidden bg-[#F5F5F5] px-4 py-4 flex flex-col space-y-3 shadow-2xl'>
            <input
              type='text'
              placeholder='Search'
              className='flex-1 outline-none px-2 py-1 border border-gray-300 rounded-lg'
            />
            <p className='font-semibold text-md mt-4 cursor-pointer transform transition duration-300 hover:text-blue-500 hover:scale-105' onClick={() => navigate('/orders')}>Profile</p>
            <p className='font-semibold text-md mt-4 cursor-pointer transform transition duration-300 hover:text-blue-500 hover:scale-105' onClick={() => navigate('/cart')}>Cart</p>
          </div>
        }



      </div>
    </div>
  )
}

export default Navbar
