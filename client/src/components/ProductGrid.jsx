import ProductCard from './ProductCard';
import React, { useState, useEffect } from 'react';
import useInterceptors from '../hooks/useInterceptors';
import { useSearchParams } from 'react-router-dom';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const api = useInterceptors();
  const [searchParams] = useSearchParams()

  
  const keyword = searchParams.get("keyword")
  const category = searchParams.get("category")
  const priceMin = searchParams.get("priceMin")
  const priceMax = searchParams.get("priceMax")
  const sort = searchParams.get("sort")



  useEffect(() => {
    const getAllProducts = async () => {
      try {

        const params = {};

        if (keyword) params.keyword = keyword;
        if (category) params.category = category;
        if (priceMin) params.min = priceMin;
        if (priceMax) params.max = priceMax;
        if (sort) params.sort = sort;

        const all = await api.get(`/products/searchList`, { params })
        setProducts(Array.isArray(all.data) ? all.data : [])

      } catch (err) {
        console.error(err)
      }
    }

    getAllProducts();
  }, [api, keyword, category, priceMin, priceMax, sort])

  return (
    <div className='overflow-y-auto min-h-screen bg-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8 mt-12'>
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
