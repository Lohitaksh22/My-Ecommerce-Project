import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from './pages/Home';
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Product from "./pages/Product";
import Account from "./pages/Account";
import Success from "./pages/Success";
import Error from "./pages/Error";
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";
import AdminAccount from "./pages/AdminPages/AdminAccount";
import AdminProducts from "./pages/AdminPages/AdminProducts";
import CreateProduct from "./pages/AdminPages/CreateProduct";
import AdminReviews from "./pages/AdminPages/AdminReviews";
import AdminOrders from "./pages/AdminPages/AdminOrders";
import AdminNavbar from "./components/adminComponents/AdminNavbar";
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

  function AdminLayout() {
    return (
      <>
        <AdminNavbar />
        <Outlet />
      </>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />



      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/account" element={<Account />} />
        <Route path="/product/:id" element={<Product />} />
      </Route>

      <Route element={<AdminLayout />} >
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/Account" element={<AdminAccount />} />
        <Route path="/admin/Products" element={<AdminProducts />} />
        <Route path="/admin/CreateListing" element={<CreateProduct />} />
        <Route path="/admin/Reviews" element={<AdminReviews />} />
        <Route path="/admin/Orders" element={<AdminOrders />} />

      </Route>

      <Route path="/success" element={<Success />}></Route>
      
      <Route path="/admin/*" element={<Error place="/admin" />} />
      <Route path="*" element={<Error place="/home" />} />
    </Routes>
  );
}

export default App;
