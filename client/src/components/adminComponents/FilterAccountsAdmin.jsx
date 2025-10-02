import { Filter } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const FilterAccountsAdmin = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const role = ["Admin", "User"]

  const rolesChange = (value) => {
    navigate(`/admin?sort=${value}`)
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

            navigate(`/admin?sort=newest`)

          }}
          className="text-sm hover:text-blue-500 font-semibold">Newest First</button>
        <button
          onClick={() => {

            navigate(`/admin?sort=oldest`)

          }}
          className="text-sm font-semibold hover:text-blue-500">Oldest First</button>

        <select className="w-full px-4 py-1 rounded-lg" 
          onChange={(e) => rolesChange(e.target.value)}
        ><option value="" className="font-blue-500">
            Select roles
          </option>
          {role.map((rol) => (
            <option key={rol} value={rol}>{rol}</option>
          ))}

        </select>
      </div>
    </div>
  )
}

export default FilterAccountsAdmin
