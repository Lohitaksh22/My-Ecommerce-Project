import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import useInterceptors from "../hooks/useInterceptors"
import { FaStar, FaRegStar, FaShoppingCart, FaUserCircle } from 'react-icons/fa'
import jwt_decode from "jwt-decode"
import { useAuth } from "../hooks/AuthContext"


const Product = () => {
  const [product, setProduct] = useState([])
  const { id } = useParams()
  const api = useInterceptors()
  const [quantity, setQuantity] = useState(0)
  const [reviews, setReviews] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [review, setReview] = useState("")
  const [rating, setRating] = useState(0)
  const [editOpen, setEditOpen] = useState(false)
  const { accessToken } = useAuth()
  const decoded = accessToken ? jwt_decode(accessToken) : null
  const userId = decoded?.id

  const getProduct = async () => {
    try {
      const res = await api.get(`/products/find/${id}`)
      setProduct(res.data)

    } catch (err) {
      console.error(err);

    }
  }

  const getReviews = async () => {
    try {
      const res = await api.get(`/reviews/${id}`)
      setReviews(res.data)



    } catch (err) {
      console.error(err)

    }
  }




  useEffect(() => {
    window.scrollTo(0, 0)
    getProduct()
    getReviews()
  }, [id, api])

  const addToCart = async () => {
    try {
      await api.put('/cart', {
        product: id,
        newquantity: quantity
      })
    } catch (err) {
      console.log(err)
    }
  }

  const addReview = async () => {
    try {
      const res = await api.post(`/reviews/${id}`, {
        review: review,
        rating: rating
      })
      setReviews(prev => [...prev, res.data])

      const newNumReviews = product.numReviews + 1
      const newAvgRating = ((product.avgRating * product.numReviews) + rating) / newNumReviews
      
      setProduct(prev => ({
        ...prev,
        numReviews: newNumReviews,
        avgRating: newAvgRating
      }))
      setIsOpen(false)
      setReview("")
      setRating(0)

    } catch (err) {
      console.error(err)
    }
  }

  const addAReview = () => {
    setIsOpen(!isOpen)
  }

  const editAReview = () => {
    setEditOpen(!editOpen)
  }

  const deleteReview = async (reviewID) => {
    try {
      await api.delete(`/reviews/${reviewID}`)
      getReviews()
      setReviews((prev) => prev.filter((item) => item._id !== reviewID))
    } catch (err) {
      console.error(err)

    }
  }

  const updateReview = async (reviewID) => {
    try {
      const res = await api.patch(`reviews/${reviewID}`, {
        review: review,
        rating: rating
      })
      console.log(res.data)

      await getReviews()
      setReviews((prev) =>
        prev.map((item) =>
          item._id === reviewID ? res.data : item
        )
      )
      setEditOpen(false)
      setReview("")
      setRating(0)
    } catch (err) {
      console.error(err);

    }
  }



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
    <div className="mt-19 min-h-screen bg-gray-100 py-10 px-4">
      {product ? (
        <div className="bg-white rounded-2xl shadow-xl p-8 md:flex md:space-x-8 max-w-5xl mx-auto">


          <div className="md:w-1/2 flex justify-center items-center">
            <img
              className="w-100 max-w-md h-auto rounded-xl object-cover shadow-lg"
              src={product.image}
              alt={product.name}
            />
          </div>


          <div className="md:w-1/2 mt-6 md:mt-0 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent cursor-pointer">
                {product.name}
              </h1>

              <p className="text-2xl font-bold bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 bg-clip-text text-transparent mt-2 cursor-pointer">
                ${product.price}
              </p>

              <div className="flex items-center space-x-2 mt-3">
                <StarRating rating={product.avgRating} />
                <p className="text-gray-600">({product.numReviews})</p>
              </div>

              <p className="mt-6 text-gray-700">{product.description}</p>
            </div>

            <div className="flex flex-col space-y-4">
              <input
                type="number"
                min={1}
                max={10}
                placeholder="100"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.floor(Number(e.target.value))))}
                className="w-15 mt-6 rounded-2xl shadow-2xl px-4 border-1 border-gray-500"
              />
              <button onClick={() => addToCart()} className="cursor-pointer mt-2 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 transition px-6 py-3 rounded-lg text-white shadow-lg text-lg font-semibold">
                Add To Cart <FaShoppingCart />
              </button>
            </div>
            {!reviews.some(r => r.user._id === userId) && (
              <div className="flex justify-end max-w-5xl mx-auto mb-4 mt-5 ml-auto">
                <button
                  onClick={addAReview}
                  className="relative left-0 top-8 font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent cursor-pointer"
                >
                  Add your review
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 text-xl mt-20">Loading product...</p>
      )}



      {reviews.length > 0 ?
        reviews.map(r => {
          return (<div key={r._id} className="flex items-center space-x-8 mt-8 bg-white rounded-2xl shadow-xl p-8 md:flex md:space-x-8 max-w-5xl mx-auto">

            <div className="flex flex-col justify-center">
              <div className="flex items-center space-x-2 mb-1">
                <FaUserCircle size={24} />
                <p>{r.user.username}</p>
              </div>

              <StarRating rating={r.stars} />
              <p className="font-semibold text-sm ">{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>

            <p className="mx-8 flex-1">{r.review}</p>
            <div className="ml-auto flex flex-col items-end ">

              {
                r.user._id === userId ?
                  <div className="flex items-center justify-top space-x-4 relative bottom-10 my-0">
                    <button onClick={editAReview} className="text-green-500 font-semibold underline underline-offset-2 text-sm hover:opacity-75 active:scale-95 ">
                      Edit
                    </button>

                    {editOpen ?
                      <div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm">
                        <div className="z-50 rounded-xl flex flex-col items-center space-y-4 bg-[#F5F5F5] shadow-2xl w-full max-w-md p-6">
                          <button
                            onClick={editAReview}
                            className="relative bottom-4 right-50 text-gray-600 hover:text-gray-800 text-xl font-bold"
                          >
                            ×
                          </button>
                          <p className="font-extrabold text-xl mb-10">Your New Review</p>
                          <input onChange={(e) => {
                            setReview(e.target.value)
                          }} type="text" placeholder="Enter Review" className="w-full px-3 py-2 rounded-border mb-10"></input>

                          <input
                            type="number"
                            min={1}
                            max={5}
                            step={1}
                            onChange={e => setRating(Math.max(1, Math.floor(Number(e.target.value))))} placeholder="Enter Number of Stars" className="w-full px-3 py-2 rounded-border"></input>
                          <button className="bg-blue-500 text-white font-semibold rounded-xl px-6 py-3 cursor-pointer shadow-xl mt-5 hover:opacity-75 active:scale-95" onClick={() => {
                            editAReview()
                            updateReview(r._id)
                            window.location.reload()
                          }}>Update Review</button>
                        </div>
                      </div>
                      : <></>}
                    <button
                      onClick={() => {
                        deleteReview(r._id)
                      }}
                      className="text-red-500 font-semibold underline underline-offset-2 text-sm hover:opacity-75 active:scale-95 ">
                      Delete
                    </button>
                  </div>
                  : <></>}

            </div>


          </div>)
        })

        : <div className="flex items-center justify-center space-x-8 mt-30 bg-white rounded-2xl shadow-xl p-8 md:flex md:space-x-8 max-w-5xl mx-auto">
          <p className="font-bold ">No reviews for this product</p>
        </div>}

      {isOpen ?
        <div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm">
          <div className="z-50 rounded-xl flex flex-col items-center space-y-4 bg-[#F5F5F5] shadow-2xl w-full max-w-md p-6">
            <button
              onClick={addAReview}
              className="relative bottom-4 right-50 text-gray-600 hover:text-gray-800 text-xl font-bold"
            >
              ×
            </button>
            <p className="font-extrabold text-xl mb-10">Your Review</p>
            <input onChange={(e) => {
              setReview(e.target.value)
            }} type="text" placeholder="Enter Review" className="w-full px-3 py-2 rounded-border mb-10"></input>

            <input type="number" min={1} max={5} onChange={e => setRating(Math.max(1, Number(e.target.value)))} placeholder="Enter Number of Stars" className="w-full px-3 py-2 rounded-border"></input>
            <button className="bg-blue-500 text-white font-semibold rounded-xl px-6 py-3 cursor-pointer shadow-xl mt-5 hover:opacity-75 active:scale-95" onClick={() => {
              addAReview()
              addReview()
            }}>Add Review</button>
          </div>
        </div>
        : <></>}
    </div>
  )

}

export default Product
