import axios from "axios";

const API_BASE =
  
     "https://my-ecommerce-project-w5lh.onrender.com"
    
export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});
