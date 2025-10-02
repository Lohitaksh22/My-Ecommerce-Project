import { useState } from "react"
import useInterceptors from "../../hooks/useInterceptors"

const CreateProduct = () => {
  const api = useInterceptors()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [imageLink, setImageLink] = useState("")
  const [category, setCategory] = useState("")
  const [msg, setMsg] = useState("")
  const [err, setErr] = useState("")

  const createListing = async () => {
    try {
      const res = await api.put("/admin/productListings", {
        name,
        price: Number(price),
        description,
        image: imageLink,
        category
      })
      setMsg(res.data.msg)
      setCategory("")
      setName("")
      setPrice()
      setDescription("")
      setImageLink("")
      setErr("")

    } catch (err) {
      setMsg("")
      setErr(err.response?.data?.msg || "Something went wrong")
      console.error(err)

    }
  }
  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center">
      <form className="mt-30 flex flex-col p-6 space-y-4 text-white bg-[#0A1A2F] w-full max-w-md  h-auto rounded-xl shadow-2xl ">
        <p className="mx-auto font-extrabold text-2xl ">Create Listing</p>

        <input onChange={(e) => { setName(e.target.value) }} className=" outline-none m-4 px-2 py-2 border-1 rounded-lg placeholder:text-white focus:bg-gray-300 focus:text-black focus:placeholder-black focus:ring-5  focus:ring-white transition duration-300 " type="text" placeholder="Enter Product Name"></input>
        <input onChange={(e) => { setDescription(e.target.value) }} className=" outline-none m-4 px-2 py-2 border-1 placeholder:text-white rounded-lg focus:bg-gray-300 focus:text-black focus:placeholder-black focus:ring-5 focus:ring-white transition duration-300 " type="text" placeholder="Enter Product Description"></input>
        <input onChange={(e) => { setPrice(e.target.value) }} className=" outline-none m-4 px-2 py-2 border-1 rounded-lg placeholder:text-white focus:bg-gray-300 focus:text-black focus:ring-5 focus:placeholder-black focus:ring-white transition duration-300 " type="number" placeholder="Enter Product Price"></input>
        <input onChange={(e) => { setImageLink(e.target.value) }} className=" outline-none m-4 px-2 py-2 border-1 rounded-lg placeholder:text-white focus:bg-gray-300 focus:text-black focus:ring-5 focus:placeholder-black focus:ring-white transition duration-300 " type="text" placeholder="Enter Product Image-Link"></input>


        <select onChange={(e) => { setCategory(e.target.value) }} className="text-gray-200 outline-none m-4 px-2 py-2 border-1 rounded-lg focus:bg-gray-300 focus:text-black focus:ring-5 focus:ring-white transition duration-300 " type="text" >
          <option value="">Enter Category</option>
          <option value="Bags">Bags</option>
          <option value="Clothing">Clothing</option>
          <option value="Electronics">Electronics</option>
          <option value="Accessories">Accessories</option>
          <option value="Shoes">Shoes</option>
        </select>
        
        <div className="flex flex-col items-center mt-5 space-y-4 ">
          {err && <p className="font-md text-red-500 font-semibold text-center">{err}</p>}
          {msg && <p className="font-md text-green-500 font-semibold text-center">{msg}</p>}
          <button type="button" onClick={() => createListing()} className="px-8 py-2 mx-auto hover:opacity-75 active:scale-95 rounded bg-white text-[#0A1A2F] w-50">Create</button>

        </div>

      </form>
    </div>
  )
}

export default CreateProduct
