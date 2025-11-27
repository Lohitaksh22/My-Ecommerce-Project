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
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(null)

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
          stars,
          page
        }
      })
      setReviews(res.data.allReviews)
      setMsg(res.data.msg)
      setTotalPages(res.data.pages)
      setErr("")
    } catch (err) {
      console.error(err)
      setErr("No Reviews Found")

    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    getReviews()
  }, [keyword, stars, sort, page])

  const handleKeyword = (value) => {


    setKeyword(value)
  }


  const arr = Array.from({ length: totalPages })

  return (
    <div className="min-h-screen bg-gray-300 p-4">
      <div className="flex flex-col px-2 py-10 max-w-4xl mx-auto w-full">

        <div className="mt-20 flex sm:flex-row items-center gap-3 w-full max-w-xl mx-auto mt-6">
          <FilterReviewsAdmin />
          <input type="text" className="flex-1 w-full border border-gray-400 rounded-2xl px-4 py-3
                   focus:ring-2 focus:ring-white focus:bg-[#0A1A2F] focus:text-white transition
                   placeholder-gray-600"
            placeholder={placeholder}

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

        {totalPages && (
          <div className="flex justify-center space-x-2 mt-6">
            {arr.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`p-2 rounded-md px-4 ${page === i + 1
                  ? "bg-[#0A1A2F] text-white font-bold"
                  : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminReviews
