import { useCart } from "../hooks/CartContext"
import { FaTrash } from "react-icons/fa"
import useInterceptors from "../hooks/useInterceptors"
import { useEffect, useState } from "react"


const Cart = () => {
  const { cart, setCart } = useCart()
  const [saveForLaterProducts, setSaveForLaterProducts] = useState([])
  const api = useInterceptors()
  const [total, setTotal] = useState(0)

  const getCart = async () => {
    try {
      const cartProducts = await api.get('/cart/')
      setCart(cartProducts.data)
    } catch (err) {
      console.log(err);

    }
  }
  const getSaveForLater = async () => {
    try {
      const res = await api.get("/cart/savelater")
      setSaveForLaterProducts(res.data)
    } catch (err) {
      console.error(err);

    }
  }

  useEffect(() => {
    getCart()
    getTotal()
    getSaveForLater()
  }, [api])

  const removeItem = async (_id) => {
    try {
      await api.patch(`/cart/remove/${_id}`, {
        product: _id
      })
      setCart(cart.filter(item =>
        item._id != _id
      ))
      getTotal()
    } catch (err) {
      console.log(err);

    }
  }

  const updateQuantity = async (_id, quantity) => {
    try {
      await api.patch(`/cart/${_id}?set=${quantity}`);

      setCart(cart.map(item =>
        item._id === _id
          ? { ...item, quantity }
          : item
      ))
      getTotal()
    } catch (err) {
      console.error(err);
    }
  };


  const getTotal = async () => {
    try {
      const tot = await api.get('/cart/total')
      setTotal((tot.data.total).toFixed(2))
    } catch (err) {
      console.error(err)

    }
  }

  const clearCart = async () => {
    try {
      await api.patch('/cart/clear')
      setCart([])
      getTotal()
    } catch (err) {
      console.error(err)

    }
  }

  const saveForLater = async (_id) => {
    try {
      await api.put(`/cart/savelater/${_id}`)
      setCart(cart.filter(item =>
        item._id != _id
      ))
      getCart()
      getTotal()
      getSaveForLater()
    } catch (err) {
      console.error(err)

    }
  }

  const clearSaved = async () => {
    try {
      await api.delete('/cart/savelater')
      getSaveForLater()
    } catch (err) {
      console.error(err)

    }
  }

  const removeSaved = async (_id) => {
    try {
      await api.delete(`/cart/savelater/${_id}`)
      getSaveForLater()

    } catch (err) {
      console.error(err)

    }
  }

  const addFromSaved = async (_id) => {
    try {
      await api.put(`/cart/fromsaved/${_id}`)
      await getCart()
      await getTotal()

    } catch (err) {
      console.error(err)

    }
  }


  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-100">
      <div className="max-w-5xl mx-auto p-6 mt-24">
        <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
        <div onClick={() => clearCart()} className=" ml-2 text-md font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent cursor-pointer hover:opacity-80 active:scale-95 transition duration-300">
          Clear Cart
        </div>

        {cart.length === 0 ? (
          <p className="text-gray-500 flex justify-center">Your cart is empty.</p>
        ) : (
          <div className="flex flex-col space-y-6">
            {cart.map(item => (
              <div key={item._id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-xl">
                <div className="flex items-center space-x-8">
                  <button onClick={() => saveForLater(item._id)} title="This will move the item to Saved for Later" className="font-semibold hover:opacity-75  active:scale-75 transition duration-500 text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl px-1 py-1 text-lg items-center">+</button>
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                  <p className="font-medium">{item.name}</p>
                </div>

                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                    className="w-16 border rounded text-center"
                  />
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-500 hover:text-red-700 active:scale-75 transition duration-500"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end mt-6">
              <div className="bg-white p-6 rounded-lg shadow-xl w-full sm:w-1/3 flex flex-col space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${total}</span>
                </div>
                <button className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto p-6 mt-24">
  <h2 className="text-2xl font-bold mb-6">Saved For Later</h2>
  <div
    onClick={() => clearSaved()}
    className="ml-2 text-md font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent cursor-pointer hover:opacity-80 active:scale-95 transition duration-300"
  >
    Clear Saved List
  </div>

  {saveForLaterProducts.length === 0 ? (
    <p className="text-gray-500 flex justify-center">No products saved</p>
  ) : (
    <div className="flex flex-col space-y-6">
      {saveForLaterProducts.map((item) => {
        const product = item.product;
        if (!product) return null; // skip if product was deleted

        return (
          <div
            key={item._id}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow-xl"
          >
            <div className="flex items-center space-x-8">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-full"
              />
              <p className="font-medium">{product.name}</p>
            </div>

            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <p className="font-semibold">${(product.price * item.quantity).toFixed(2)}</p>
              
              <button
                onClick={() => removeSaved(item._id)}
                className="text-red-500 hover:text-red-700 active:scale-75 transition duration-500"
              >
                <FaTrash />
              </button>

              <button
                onClick={() => addFromSaved(item._id)}
                title="Move item back to Cart"
                className="font-semibold hover:opacity-75 active:scale-75 transition duration-500 text-white bg-gradient-to-r from-green-500 via-blue-500 to-pink-500 rounded-full w-8 h-8 flex items-center justify-center text-lg"
              >
                +
              </button>
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>

    </div>
  )
}

export default Cart
