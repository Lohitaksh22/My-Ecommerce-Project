import { Filter } from "lucide-react"
import { useState } from "react"
import useInterceptors from "../hooks/useInterceptors"
import { useNavigate } from "react-router-dom"

const FilterProducts = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(0)
  const [category, setCategory] = useState("")
  const categories = ["Bags", "Clothing", "Electronics", "Accessories", "Shoes"]

  const categoryChange = (value) => {
    setCategory(value)
    navigate(`/home?category=${value}`)
  }

  return (
    <div className="relative inline-block">

      <button onClick={() => setIsOpen(!isOpen)}>
        <Filter size={22} className="hover:text-blue-500" />
      </button>


      <div
        className={` flex flex-col items-center justify-center space-y-4 w  absolute right-0 left-0 mt-3 w-80 bg-[#F5F5F5] px-6 py-4 flex flex-col justify-center shadow-xl rounded transform transition-all duration-300 ease-out
          ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
      >
        <button
          onClick={() => {
            navigate(`/home?sort=priceAsc`);
          }}
          className="text-sm hover:text-blue-500 font-semibold"
        >
          Price: Low → High
        </button>
        <button
          onClick={() => {

            navigate(`/home?sort=priceDesc`)

          }}
          className="text-sm hover:text-blue-500 font-semibold">Price: High → Low</button>

        <button
          onClick={() => {

            navigate(`/home?sort=numberOfRatingsDesc`)

          }}
          className="text-sm hover:text-blue-500 font-semibold">Reviews:  High → Low</button>

        <button
          onClick={() => {

            navigate(`/home?sort=numberOfRatingsAsc`)

          }}
          className="text-sm hover:text-blue-500 font-semibold">Reviews:  Low → High</button>


        <button
          onClick={() => {

            navigate(`/home?sort= newest`)

          }}
          className="text-sm hover:text-blue-500 font-semibold">Newest First</button>
        <button
          onClick={() => {

            navigate(`/home?sort= oldest`)

          }}
          className="text-sm font-semibold hover:text-blue-500">Oldest First</button>

        <input type="Number" min={1} placeholder="Min-Price"
          onChange={(e) => {
            const value = parseFloat(e.target.value).toFixed(2)
            setMinPrice(value)
            navigate(`/home?priceMin=${value}`)
          }}
          className="px-2 py-1 w-full border-1 outline-none border-blue-500 rounded focus:ring-2 focus:ring-blue-500 transition duration-300"
        />

        <input type="Number" min={1} placeholder="Max-Price"
          onChange={(e) => {
            const value = parseFloat(e.target.value).toFixed(2)
            setMaxPrice(value)
            navigate(`/home?priceMin=${minPrice}`)
          }}
          className="px-2 py-1 w-full border-1 outline-none border-blue-500 rounded focus:ring-2 focus:ring-blue-500 transition duration-300"
        />

        <select className="w-full px-4 py-1 rounded-lg" value={category}
          onChange={(e) => categoryChange(e.target.value)}
        ><option className="font-blue-500">
            Select Category
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}

        </select>
      </div>
    </div>
  )
}

export default FilterProducts
