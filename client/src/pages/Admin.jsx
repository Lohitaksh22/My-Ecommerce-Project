import useInterceptors from "../hooks/useInterceptors"
import { useState, useEffect } from "react"
import { FaTrash, FaSearch } from "react-icons/fa"
import { useSearchParams } from "react-router-dom"
import FilterAccountsAdmin from "../components/adminComponents/FilterAccountsAdmin"

const Admin = () => {
  const api = useInterceptors()
  const [allAccounts, setAllAccounts] = useState([])
  const [sort, setSort] = useState("")
  const [placeholder, setPlaceholder] = useState("🔍 Search Account...")
  const [search, setSearch] = useState("")
  const [accountLength, setAccountLength] = useState(0)
  const [searchParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)



  const getAllAccounts = async () => {
    try {
      const res = await api.get(`/admin/findAccount?keyword=${search}&sort=${sort}&page=${page}`)

      setAllAccounts(res.data.accounts)
      setAccountLength(res.data.length)
      setTotalPages(res.data.pages)
      console.log(totalPages);
      

    } catch (err) {
      console.error(err)

    }
  }
  useEffect(() => {
    setSort(searchParams.get("sort") || "")
  }, [searchParams])

  useEffect(() => {
    getAllAccounts()
      window.scrollTo({ top: 0, behavior: "smooth" })
  }, [api, search, sort, page])

  const deleteAccount = async (username, email) => {
    try {
      await api.delete("/admin/findAccount", {
        data: {
          username,
          email
        }
      })
      getAllAccounts()

    } catch (err) {
      console.error(err)

    }
  }

  const promoteAccount = async (username, email) => {
    try {
      await api.patch("/admin/findAccount", {
        username,
        email

      })
      getAllAccounts()

    } catch (err) {
      console.error(err)

    }
  }

  const arr = Array.from({ length: totalPages || 0 })

  return (
    <div className="min-h-screen bg-gray-300">
      <div className="px-8 py-24">
        <div className="flex items-center gap-2 max-w-md w-full mt-8 mx-auto">
          <FilterAccountsAdmin />
          <input type="text" className=" mx-8 flex-1 max-w-sm w-full border border-gray-400 hover::placeholder-text-white focus:ring-5 focus:ring-white transition duration-300 focus:bg-[#0A1A2F] focus:text-white  flex mx-auto px-4 py-2 rounded-2xl" placeholder={placeholder}
            onFocus={() => setPlaceholder("Type to search...")} onBlur={() => setPlaceholder("🔍 Search Account...")}

            onChange={(e) => {
              setSearch(e.target.value)
            }}
          ></input>
        </div>
        {allAccounts?.length === 0 ? (
          <p className="text-center text-gray-700 mx-auto mt-30">No accounts found</p>
        ) : (
          <div className="mt-8 space-y-4 w-full max-w-xl mx-auto">
            {accountLength && (<p className="my-6 text-md">{accountLength} Accounts Found</p>)}
            {allAccounts?.map(account => (
              <div key={account._id} className="flex items-center justify-between space-y-2 my-4 bg-white px-8 py-4 m-2 rounded-2xl shadow-2xl w-full  md:max-w-lg lg:max-w-xl mx-auto hover:scale-99 ">

                <div className="flex flex-col space-y-2">
                  <p className="font-semibold text-lg">UserName: {account.username}</p>
                  <p className="text-sm font-semibold text-gray-500">Email: {account.email}</p>
                  <p className="text-sm font-semibold text-gray-500">Role: {account.roles || "User"}</p>
                  <p className="text-sm font-semibold text-gray-500">Last-Login: {new Date(account.lastLogin).toLocaleDateString()}</p>

                </div>

                <div className="ml-auto flex items-center space-x-4 ">
                  <FaTrash title="Delete Account" onClick={() => { deleteAccount(account.username, account.email) }} className="text-red-500 hover:opacity-75 cursor-pointer " size={20} />
                  <button title="Promote User To Admin" onClick={() => { promoteAccount(account.username, account.email) }} className="font-semibold hover:opacity-75 cursor-pointer  active:scale-75 transition duration-500 text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl px-3 py-1  text-sm items-center">Promote</button>
                </div>
              </div>
            ))}
          </div>
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

export default Admin
