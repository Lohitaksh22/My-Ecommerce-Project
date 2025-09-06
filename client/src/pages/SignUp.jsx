import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const SignUp = () => {
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await axios.post("http://localhost:3500/account/register", {
        username,
        email,
        password,
      })

      console.log(res.data)
      navigate("/login") 
    } catch (err) {
      console.error(err.response?.data)
      setError(err.response?.data?.msg || "Signup failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen bg-linear-45 from-green-400 to-purple-400 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-4 bg-[#F5F5F5] shadow-2xl w-full max-w-md h-auto px-6 py-8 rounded-lg"
      >
        <p className="text-2xl font-bold mb-4">Register Here</p>

        <input
          type="text"
          placeholder="UserName"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="outline-none border border-green-500 rounded px-4 py-2 w-full focus:ring-2 focus:ring-green-400 transition duration-300"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="outline-none border border-green-500 rounded px-4 py-2 w-full focus:ring-2 focus:ring-green-400 transition duration-300"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="outline-none border border-green-500 rounded px-4 py-2 w-full focus:ring-2 focus:ring-green-400 transition duration-300"
        />

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mb-2 shadow-lg mt-4 bg-green-700 rounded px-16 py-2 text-white text-lg transform transition duration-300 hover:scale-105 hover:bg-green-500 cursor-pointer focus:outline-none focus:ring focus:ring-green-600 focus:ring-offset-1 active:bg-green-700"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  )
}

export default SignUp
