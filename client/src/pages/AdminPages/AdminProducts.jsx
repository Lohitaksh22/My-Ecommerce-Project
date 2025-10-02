import { useState, useEffect, } from "react"
import useInterceptors from "../../hooks/useInterceptors"
import FilterProductsAdmin from "../../components/adminComponents/FilterProductsAdmin"
import { useSearchParams } from "react-router-dom"
import { FaTrash } from "react-icons/fa"

const AdminProducts = () => {
  const api = useInterceptors()
  const [keyword, setKeyword] = useState("")
  const [category, setCategory] = useState("")
  const [max, setMax] = useState(Infinity)
  const [min, setMin] = useState(0)
  const [sort, setSort] = useState("")
  const [placeholder, setPlaceholder] = useState("🔍 Search Products...")
  const [products, setProducts] = useState([])
  const [searchParams] = useSearchParams()
  const [isUpdate, setIsUpdate] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [imageLink, setImageLink] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [msg, setMsg] = useState("")
  const [err, setErr] = useState("")
  const [saveId, setSaveId] = useState(null)




  useEffect(() => {
    setKeyword(searchParams.get("keyword") || "")
    setCategory(searchParams.get("category") || "")
    setMin(Number(searchParams.get("priceMin")) || 0)
    setMax(Number(searchParams.get("priceMax")) || Infinity)
    setSort(searchParams.get("sort") || "")
  }, [searchParams])

  const getProducts = async () => {

    try {
      const res = await api.get('/admin/allProductListings', {
        params: {
          keyword,
          min,
          max,
          sort,
          category
        }
      })
      setProducts(res.data)
      console.log(res.data);


    } catch (err) {
      console.error(err)

    }
  }
  useEffect(() => {

    getProducts()
  }, [api, keyword, category, sort, min, max])



  const updateProduct = async (id) => {
    try {
      const res = await api.patch("/admin/productListings", {
        id,
        name,
        price,
        description,
        image: imageLink,
        category: newCategory
      })
      setMsg(res.data.msg)
      getProducts()
      setCategory("")
      setName("")
      setPrice()
      setDescription("")
      setImageLink("")
      setErr("")
      setMsg("")
    } catch (err) {
      setErr(err.response?.data?.msg)
      console.error(err)

    }
  }

  const deleteProduct = async (id) => {
    try{
      await api.delete('/admin/productListings' , { params: { id } })
      getProducts()
    }catch(err){
      console.error(err);
      
    }
  }


  return (
    <div className="min-h-screen bg-gray-300 p-8 ">
      <div className="mt-25 flex items-center gap-2 max-w-md w-full mx-auto">
        <FilterProductsAdmin />
        <input
          onChange={(e) => {
            setKeyword(e.target.value)
          }}
          type="text"
          className="flex-1 px-4 py-2 rounded-2xl border border-gray-400 placeholder-[#0A1A2F] focus:outline-none focus:ring-5 focus:ring-white focus:bg-[#0A1A2F] focus:text-white focus:placeholder-white transition duration-300"
          placeholder={placeholder}
          onFocus={() => setPlaceholder("Type to Search....")}
          onBlur={() => setPlaceholder("🔍 Search Products...")}
        />


      </div>
      <div className="flex flex-wrap gap-6 mt-10 justify-center ">
        {products?.length > 0 ?
          products.map((item) => (
            <div key={item._id} className="flex flex-col items-center justify-center shadow-xl w-64 h-[400px] bg-gray-100 mb-10 rounded-xl">

              <img src={item.image} className="w-48 h-48 object-cover rounded-lg cursor-pointer" alt={item.name} />

              <div className="text-center mt-2">
                <h2 className="text-lg font-semibold line-clamp-2">{item.name}</h2>
                <h2 className="text-gray-700 mt-1">${item.price}</h2>

              </div>

              <div className="flex mt-6 space-x-4 text-center w-auto h-auto">
                <button onClick={() => {
                  setIsUpdate(!isUpdate) 
                  setSaveId(item._id)}} className="cursor-pointer font-semibold hover:opacity-75  active:scale-75 transition duration-500 text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl px-3 py-1  text-sm items-center">Update</button>
                <FaTrash title="Delete Listing" onClick={() => { deleteProduct(item._id)}} className="text-red-500 hover:opacity-75 cursor-pointer" size={20} />
              </div>
            </div>

          ))

          : <p className="mt-20 mx-auto text-lg ">No Products Found</p>}
      </div>

      {isUpdate && (<div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm">
        <div className="z-50 rounded-xl flex flex-col items-center space-y-4 bg-[#F5F5F5] shadow-2xl w-full max-w-md p-6">
          <button
            onClick={() => setIsUpdate(false)}
            className="relative bottom-4 right-50  hover:text-gray-800 text-xl font-bold"
          >
            x
          </button>
          <p className="font-extrabold text-xl text-[#0A1A2F]  mb-10">Update Product</p>

          <input onChange={(e) => { setName(e.target.value) }} className="w-full outline-none m-4 px-2 py-2 border-1 rounded-lg focus:bg-[#0A1A2F] focus:text-white focus:placeholder-white focus:ring-5 focus:ring-gray-300 transition duration-300  placeholder:text-black" type="text" placeholder="Enter Product Name"></input>
          <input onChange={(e) => { setDescription(e.target.value) }} className="w-full outline-none m-4 px-2 py-2 border-1 rounded-lg focus:bg-[#0A1A2F] focus:text-white focus:placeholder-white focus:ring-5 focus:ring-gray-300 transition duration-300  placeholder:text-black" type="text" placeholder="Enter Product Description"></input>
          <input onChange={(e) => { setPrice(e.target.value) }} className="w-full outline-none m-4 px-2 py-2 border-1 rounded-lg focus:bg-[#0A1A2F] focus:text-white focus:ring-5 focus:placeholder-white focus:ring-gray-300 transition duration-300  placeholder:text-black " type="number" placeholder="Enter Product Price"></input>
          <input onChange={(e) => { setImageLink(e.target.value) }} className="w-full outline-none m-4 px-2 py-2 border-1 rounded-lg focus:bg-[#0A1A2F] focus:text-white focus:ring-5 focus:placeholder-white focus:ring-gray-300 transition duration-300 placeholder:text-black   " type="text" placeholder="Enter Product Image-Link"></input>


          <select onChange={(e) => { setNewCategory(e.target.value) }} className=" w-full outline-none m-4 px-2 py-2 border-1 rounded-lg focus:bg-[#0A1A2F] focus:text-white focus:ring-5 focus:ring-gray-300 transition duration-300" type="text" >
            <option value="">Enter Category</option>
            <option value="Bags">Bags</option>
            <option value="Clothing">Clothing</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
            <option value="Shoes">Shoes</option>
          </select>
          {err && <p className="font-md text-red-500 font-semibold text-center">{err}</p>}
          {msg && <p className="font-md text-green-500 font-semibold text-center">{msg}</p>}
          <button type="button" onClick={() => updateProduct(saveId)} className="px-8 py-2 mt-5 mx-auto hover:cursor-pointer active:scale-95 rounded bg-[#0A1A2F]  text-white w-50">Update</button>
        </div>
      </div>)}
    </div>
  )
}

export default AdminProducts
