import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import Home from './pages/Home';
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Navbar from "./components/Navbar";
import './App.css';


function App() {


  function Layout() {
    return (
      <>
        <Navbar />
        <Outlet />
      </>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route
        path="/login"
        element={<Login/>}
      />
      <Route path="/register" element={<SignUp />} />

      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Order />} />
      </Route>

      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
}

export default App;
