import { Filter } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const FilterProductsAdmin = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const [category, setCategory] = useState("")
  const categories = ["Bags", "Clothing", "Electronics", "Accessories", "Shoes"]

  const categoryChange = (value) => {
    setCategory(value)
    navigate(`/admin/Products?category=${value}`)
  }

  return (
    <div className="relative inline-block">

      <button onClick={() => setIsOpen(!isOpen)}>
        <Filter size={22} className="hover:text-white" />
      </button>


      <div
        className={`z-50 flex flex-col items-center justify-center space-y-4 w  absolute right-0 left-0 mt-3 w-80 bg-[#F5F5F5] px-6 py-4 flex flex-col justify-center shadow-xl rounded transform transition-all duration-300 ease-out
          ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
      >
        <button
          onClick={() => {
            navigate(`/admin/Products?sort=priceAsc`);
          }}
          className="text-sm hover:text-blue-500 font-semibold"
        >
          Price: Low → High
        </button>
        <button
          onClick={() => {

            navigate(`/admin/Products?sort=priceDesc`)

          }}
          className="text-sm hover:text-blue-500 font-semibold">Price: High → Low</button>

        <button
          onClick={() => {

            navigate(`/admin/Products?sort=numberOfRatingsDesc`)

          }}
          className="text-sm hover:text-blue-500 font-semibold">Reviews:  High → Low</button>

        <button
          onClick={() => {

            navigate(`/admin/Products?sort=numberOfRatingsAsc`)

          }}
          className="text-sm hover:text-blue-500 font-semibold">Reviews:  Low → High</button>


        <button
          onClick={() => {

            navigate(`/admin/Products?sort=newest`)

          }}
          className="text-sm hover:text-blue-500 font-semibold">Newest First</button>
        <button
          onClick={() => {

            navigate(`/admin/Products?sort=oldest`)

          }}
          className="text-sm font-semibold hover:text-blue-500">Oldest First</button>

        <input type="Number" min={1} placeholder="Min-Price"
          onChange={(e) => {
            const value = parseFloat(e.target.value).toFixed(2)
            if(isNaN(value)){
              navigate(`/admin/Products?priceMin=${0}`)
            }
            else{
            navigate(`/admin/Products?priceMin=${value}`)
            }
            
          }}
          className="px-2 py-1 w-full border-1 outline-none border-blue-500 rounded focus:ring-2 focus:ring-blue-500 transition duration-300"
        />

        <input type="Number" min={1} placeholder="Max-Price"
          onChange={(e) => {
            const value = parseFloat(e.target.value).toFixed(2)
            if(value === 0 || isNaN(value)){
              navigate(`/admin/Products?priceMax=${Infinity}`)
            }
            else{
            navigate(`/admin/Products?priceMax=${value}`)
            }
            
          }}
          className="px-2 py-1 w-full border-1 outline-none border-blue-500 rounded focus:ring-2 focus:ring-blue-500 transition duration-300"
        />

        <select className="w-full px-4 py-1 rounded-lg" value={category}
          onChange={(e) => categoryChange(e.target.value)}
        ><option value="" className="font-blue-500">
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

export default FilterProductsAdmin
