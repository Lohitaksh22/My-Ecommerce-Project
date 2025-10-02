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
  const [isAdmin, setIsAdmin] = useState(false)
  const [role, setRole] = useState("User")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await axios.post("http://localhost:3500/account/register", {
        username,
        email,
        password,
        admin: role
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

  const handleAdmin = () => {
    const newValue = !isAdmin
    setIsAdmin(newValue)
    setRole(newValue ? "Admin" : "User")

  }

  const validPassword = (password) => {
    if (!password) return false
    const minLength = password.length >= 8
    const hasNumber = /\d/.test(password)
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return minLength && hasNumber && hasUpper && hasLower && hasSpecial
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

        <p className='font-bold bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent cursor-pointer hover:opacity-80'>Register as an Admin?</p>
        <button
        type="button"
          onClick={() => handleAdmin()}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${isAdmin ? "bg-blue-600" : "bg-gray-300"
            }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${isAdmin ? "translate-x-6" : "translate-x-1"
              }`}
          ></span>
        </button>

        {validPassword(password) ?

          (
            <button
              type="submit"
              disabled={loading}
              className="mb-2 shadow-lg mt-4 bg-green-700 rounded px-16 py-2 text-white text-lg transform transition duration-300 hover:scale-105 hover:bg-green-500 cursor-pointer focus:outline-none focus:ring focus:ring-green-600 focus:ring-offset-1 active:bg-green-700"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          )
          :
          <div className="text-sm font-bold text-red-500 leading-relaxed mt-2">
            Password must include:
            <ul className="list-disc list-inside text-red-500 text-sm font-semibold ">
              <li className={password.length >= 8 ? "text-green-500" : "text-red-500"}>8+ characters{ }</li>
              <li className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? "text-green-500" : "text-red-500"}>Upper & lower case</li>
              <li className={/[\d]/.test(password) ? "text-green-500" : "text-red-500"}>Number</li>
              <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-green-500" : "text-red-500"}>Special character</li>
            </ul>
          </div>
        }

        {error && <p className="text-red-600">{error}</p>}


      </form>
    </div>
  )
}

export default SignUp
