import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from '../context/AuthContext.js'
import api, {Interceptors} from "./api"
import { useAuth } from '../context/AuthContext.js'
import { useNavigate } from 'react-router-dom'
import React from 'react'

const InterceptorsSetUp = ({children}) => {
  const {accessToken, setAccessToken} = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    Interceptors(accessToken, setAccessToken, navigate)
  }, [])
  return children
}

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <InterceptorsSetUp>
      <App />
    </InterceptorsSetUp>
    
  </AuthProvider>,
)
