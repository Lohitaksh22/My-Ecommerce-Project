import useInterceptors from "../../hooks/useInterceptors"
import { useState, useEffect } from "react"
import FilterReviewsAdmin from "../../components/adminComponents/FilterReviewsAdmin"
import { useSearchParams } from "react-router-dom"

const AdminReviews = () => {
  const api = useInterceptors()
  const [reviews, setReviews] = useState([])
  const [keyword, setKeyword] = useState("")
  const [msg, setMsg] = useState("")
  const [placeholder, setPlaceholder] = useState("🔍 Search Reviews...")
  const [searchParams] = useSearchParams()
  const [sort, setSort] = useState("")
  const [stars, setStars] = useState(null)
  const [err, setErr] = useState("")
  

  useEffect(() => {
    setSort(searchParams.get("sort") || "")
    setStars(searchParams.get("stars") || null)
  }, [searchParams])

  const getReviews = async () => {
    try {
      const res = await api.get('/admin/totalReviews', {
        params: {
          keyword,
          sort,
          stars
        }
      })
      setReviews(res.data.allReviews)
      setMsg(res.data.msg)
      setErr("")
    } catch (err) {
      console.error(err)
      setErr("No Reviews Found")

    }
  }

  useEffect(() => {
    getReviews()
  }, [keyword, stars, sort])

  const handleKeyword = (value) => {


    setKeyword(value)
  }
  return (
    <div className="min-h-screen p-8 bg-gray-300">
      <div className="flex flex-col px-8 py-24">
        <div className="flex items-center gap-2 max-w-md w-full mx-auto">
          <FilterReviewsAdmin />
          <input type="text" className="mx-8 flex-1 max-w-sm w-full border border-gray-400 hover::placeholder-text-white focus:ring-5 focus:ring-white transition duration-300 focus:bg-[#0A1A2F] focus:text-white  flex mx-auto px-4 py-2 rounded-2xl" placeholder={placeholder}
            onFocus={() => setPlaceholder("Type to search through accounts or products...")} onBlur={() => setPlaceholder("🔍 Search Reviews...")}

            onChange={(e) => {
              handleKeyword(e.target.value)
            }}
          ></input>
        </div>
       

        {(reviews.length > 0 && !err) ? (
          <div className="mt-8 space-y-4 w-full max-w-xl mx-auto">
            <p>{msg}</p>
            {reviews.map((r) => (
              <div
                key={r._id}
                className="p-4 bg-white rounded-xl shadow-xl hover:scale-99"
              >
                <p className="font-semibold">{r.user?.username}</p>
                <p className="text-sm text-gray-600">{r.product?.name}</p>
                <p className="mt-2">{r.review}</p>
                <p className="mt-1 text-yellow-500">⭐ {r.stars}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-30 mx-auto text-lg ">{err || "No Reviews Found"}</p>
        )}

      </div>
    </div>
  )
}

export default AdminReviews
