import { Filter } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const FilterReviewsAdmin = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()


  return (
    <div className="relative inline-block">

      <button onClick={() => setIsOpen(!isOpen)}>
        <Filter size={22} className="hover:text-white" />
      </button>


      <div
        className={`z-50 flex flex-col items-center justify-center space-y-4   absolute right-0 left-0 mt-3 w-35 bg-[#F5F5F5] px-6 py-4 flex flex-col justify-center shadow-xl rounded transform transition-all duration-300 ease-out
          ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
      >


        <button
          onClick={() => {

            navigate(`/admin/Reviews?sort=newest`)

          }}
          className="text-sm hover:text-blue-500 font-semibold">Newest First</button>
        <button
          onClick={() => {

            navigate(`/admin/Reviews?sort=oldest`)

          }}
          className="text-sm font-semibold hover:text-blue-500">Oldest First</button>

        <input type="number"  min={1} step={1} max={5} placeholder="Stars"
          onChange={(e) => {
            if(e.target.value === "") {navigate(`/admin/Reviews`)
              return}
            let value = Number(e.target.value)
            if (value < 1) value = 1
            if (value > 5) value = 5

            navigate(`/admin/Reviews?stars=${value}`)


          }}
          className="px-2 py-1 w-20 border-1 outline-none border-blue-500 rounded focus:ring-2 focus:ring-blue-500 transition duration-300"
        />


      </div>
    </div>
  )
}

export default FilterReviewsAdmin
