import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import useInterceptors from "../hooks/useInterceptors"
import { FaStar, FaRegStar } from 'react-icons/fa'


const Product = () => {
  const [product, setProduct] = useState(null)
  const { id } = useParams()
  const api = useInterceptors()

  const getProduct = async () => {
    try {
      const res = await api.get(`/products/find/${id}`)
      setProduct(res.data)
    } catch (err) {
      console.error(err);

    }
  }

  useEffect(() => {
    getProduct()
  }, [id, api])



  const StarRating = ({ rating }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? <FaStar color="gold" /> : <FaRegStar color="gold" />}
          </span>
        ))}
      </div>
    )
  }



  return (
    <div className="mt-19  min-h-screen overflow-x-hidden bg-gray-100">
      <div className="flex space-x-4">
        <img className="w-100 h-100" src={product.image}></img>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">{product.name}</h1>
          <p>{product.description}</p>
          <StarRating rating={product.avgRating} />
          <p>${product.price}</p>
        </div>
      </div>
    </div>
  )
}

export default Product
