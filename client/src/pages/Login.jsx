import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../hooks/AuthContext'

const Login = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

    const { setAccessToken } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await axios.post("http://localhost:3500/account/login", {
        email,
        password,
        username
      }, {
        withCredentials: true
      })
      console.log(response?.data.accessToken)
      setAccessToken(response.data.accessToken)
      if(response.data.roles === "Admin")
      {
        navigate('/admin')
      }
      else{
      navigate('/home')
      }

    } catch (err) {
      console.log(err);
      
      setError(err.response?.data?.msg || "Login Failed. Please Try again")

    } finally {
      setIsLoading(false)
    }
  }

  
  return (
    <div className='h-screen bg-linear-45 from-blue-400 to-purple-400 flex justify-center items-center'>

      <form onSubmit={handleSubmit} className='rounded flex flex-col items-center space-y-4 bg-[#F5F5F5] shadow-2xl w-full max-w-md h-auto'>
        <p className='text-2xl font-bold my-6'>Welcome Back!</p>

        <input type='text' onChange={(e) => { setUsername(e.target.value)}} placeholder='UserName' className='outline-none border border-blue-500 rounded px-4 py-2 w-19/20
           focus:ring-2 focus:ring-blue-400 transition duration-300'  />
        <input onChange={(e) => setEmail(e.target.value)} type='email' placeholder='Email' className='outline-none border border-blue-500 rounded px-4 py-2
          w-19/20 invalid:border-pink-500 invalid:text-pink-500 focus:invalid:ring-2 focus:invalid:ring-pink-500  focus:ring-2 focus:ring-blue-400 transition duration-300'/>
        <input onChange={(e) => setPassword(e.target.value)} type='password' placeholder='Password' className='
        outline-none border border-blue-500 rounded px-4 py-2
          w-19/20 invalid:border-pink-500 invalid:text-pink-500  focus:ring-2 focus:ring-blue-400 transition duration-300' />

        <button className='shadow-lg mt-4 bg-blue-700 rounded px-16 py-2 text-white text-lg transform transition duration-300 hover:scale-105 hover:bg-blue-500 cursor-pointer focus:outline-none focus:ring focus:ring-blue-600 focus:ring-offset-1 active:bg-blue-700'
          disabled={isLoading}
          onClick={handleSubmit}
         


        >{isLoading ? "Logging-in...." : "Log-in"}</button>

        {error && <p className='cursor-pointer text-pink-500'>{error}</p>}

        <p className='font-semibold mt-8 hover:text-blue-500 cursor-pointer mb-6 active:underline active:underline-offset-4 '
          onClick={() => { navigate('/register') }}>Don't Have an Account? Sign-up here</p>
      </form>
    </div>
  )
}

export default Login
