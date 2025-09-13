import ProductCard from './ProductCard';
import React, { useState, useEffect } from 'react';
import useInterceptors from '../hooks/useInterceptors';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const api = useInterceptors();

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const all = await api.get("/products/all");
        setProducts(all.data.products);
        console.log("Products:", all.data.products);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    }

    getAllProducts();
  }, [api])

  return (
    <div className='min-h-screen bg-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8 mt-12'>
      {products?.map((item) => (
        <ProductCard
          key={item._id}
          _id={item._id}
          name={item.name}
          image={item.image}
          price={item.price}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
