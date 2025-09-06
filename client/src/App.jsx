import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"
import Home from './pages/Home'
import Cart from "./pages/Cart"
import Order from "./pages/Order"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Navbar from "./components/Navbar"
import './App.css'
import { useAuth } from "../context/AuthContext"
function App() {
  function Layout() {
    return (
      <>
        <Navbar />
        <Outlet />
      </>
    )
  }

  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login accessToken={accessToken} setAccessToken={setAccessToken} />} />
        <Route path="/register" element={<SignUp />} />


        <Route element={<Layout />} >
          <Route path="/home" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Order />} />
        </Route>

        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
