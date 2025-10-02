import React from 'react'
import { useNavigate } from "react-router-dom";

const Error = ({place}) => {
  const navigate = useNavigate()
    return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC] text-center px-4">
      <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
        404
      </h1>
      <p className="mt-4 text-xl font-semibold text-gray-600">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <button
        onClick={() => navigate(place)}
        className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
      >
        Go Home
      </button>
    </div>
  
  )
}

export default Error
