const Cart = require('../models/Cart')
const Product = require('../models/Product')
const mongoose = require('mongoose')

const getCart = async (req, res) => {
  try {
    const userId = req.user.id
    const cart = await Cart.findOne({ user: userId }).populate('products.product', 'name price image')
    if (!cart || cart.products.length === 0) return res.status(404).json({ msg: "No Products in Cart" })
    const products = cart.products.filter(item => item.product).map(item => ({
      _id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      quantity: item.quantity
    }))
    res.status(200).json(products)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

const addProductToCart = async (req, res) => {
  try {
    const userId = req.user.id
    const { product, newquantity } = req.body
    if (!product || !newquantity) return res.status(400).json({ msg: "No product or quantity provided" })

    let cart = await Cart.findOne({ user: userId }).populate("products.product", "name price image")
    if (!cart) cart = new Cart({ user: userId, products: [] })

    const existingProduct = cart.products.find(item => item.product?._id.toString() === product)
    if (existingProduct) {
      existingProduct.quantity += newquantity
    } else {
      cart.products.push({ product, quantity: newquantity })
    }

    await cart.save()
    await cart.populate("products.product", "name price image")

    const products = cart.products.filter(item => item.product).map(item => ({
      _id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      quantity: item.quantity
    }))
    res.status(200).json(products)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

const updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id
    const productID = req.params.id
    if (!mongoose.Types.ObjectId.isValid(productID)) return res.status(404).json({ msg: "Invalid Product ID" })

    const cart = await Cart.findOne({ user: userId }).populate("products.product", "name price image")
    if (!cart) return res.status(404).json({ msg: "Add Products First" })

    const productItem = cart.products.find(item => item.product?._id.toString() === productID)
    if (!productItem) return res.status(404).json({ msg: "Product not in cart" })

    const setQty = req.query.set
    if (setQty) productItem.quantity = Number(setQty)
    if (productItem.quantity <= 0) cart.products = cart.products.filter(item => item.product?._id.toString() !== productID)

    await cart.save()
    const products = cart.products.filter(item => item.product).map(item => ({
      _id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      quantity: item.quantity
    }))
    res.status(200).json({ msg: "Updated Product", cart: products })
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

const removeProduct = async (req, res) => {
  try {
    const userId = req.user.id
    const productID = req.params.id
    if (!mongoose.Types.ObjectId.isValid(productID)) return res.status(400).json({ msg: "Invalid Product Id" })

    const cart = await Cart.findOne({ user: userId }).populate("products.product", "name price image")
    if (!cart) return res.status(404).json({ msg: "Add Product First" })

    const productItem = cart.products.find(item => item.product?._id.toString() === productID)
    if (!productItem) return res.status(404).json({ msg: "Product Not Found" })

    cart.products = cart.products.filter(item => item.product?._id.toString() !== productID)
    await cart.save()
    res.status(200).json({ msg: "Product has been deleted", product: productItem })
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

const clearCart = async (req, res) => {
  try {
    const userId = req.user.id
    const cart = await Cart.findOne({ user: userId })
    if (!cart) return res.status(404).json({ msg: "No Cart Found" })
    cart.products = []
    await cart.save()
    res.status(200).json({ msg: "Cart has been cleared", cart })
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

const deleteCart = async (req, res) => {
  try {
    const userId = req.user.id
    const cart = await Cart.findOne({ user: userId })
    if (!cart) return res.status(404).json({ msg: "No Cart Found" })
    await cart.deleteOne()
    res.status(200).json({ msg: "Cart has been deleted", cart })
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

const getCartTotal = async (req, res) => {
  try {
    const userId = req.user.id
    const foundCart = await Cart.findOne({ user: userId }).populate('products.product', 'price')
    if (!foundCart) return res.status(404).json({ msg: "Cart Not Found" })

    let total = 0
    foundCart.products.forEach((item) => {
      if (item.product && item.product.price) {
        total += Number(item.product.price * item.quantity)
      }
    })

    res.status(200).json({ total }) 
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}


const saveForLater = async (req, res) => {
  try {
    const productID = req.params.id
    if (!mongoose.Types.ObjectId.isValid(productID)) return res.status(400).json({ msg: "Invalid Product Id" })

    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) return res.status(404).json({ msg: "No Cart Found" })

    const productItem = cart.products.find(item => item.product?.toString() === productID)
    if (!productItem) return res.status(404).json({ msg: "Product Not in Cart" })

    cart.products = cart.products.filter(item => item.product?.toString() !== productID)
    cart.savedForLater.push({ product: productID, quantity: productItem.quantity })
    await cart.save()
    res.status(200).json({ msg: "Product saved for later", cart })
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

const getSavedForLater = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('savedForLater.product', 'name price image')
    if (!cart) return res.status(404).json({ msg: "No Cart Found" })
    const products = cart.savedForLater.filter(item => item.product)
    res.status(200).json(products)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

const removeSaveForLater = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('savedForLater.product', 'name price image')
    if (!cart) return res.status(404).json({ msg: "No Cart Found" })

    const productID = req.params.id
    if (!mongoose.Types.ObjectId.isValid(productID)) return res.status(400).json({ msg: "Invalid Product Id" })

    cart.savedForLater = cart.savedForLater.filter(item => item._id.toString() !== productID)
    await cart.save()
    res.status(200).json({ msg: "Product removed from save" })
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

const clearSaved = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('savedForLater.product', 'name price image')
    if (!cart) return res.status(404).json({ msg: "No Cart Found" })
    cart.savedForLater = []
    await cart.save()
    res.status(200).json({ msg: "Saved For Later has been cleared" })
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

const addFromSaved = async (req, res) => {
  try {
    const userId = req.user.id
    const productID = req.params.id

    if (!mongoose.Types.ObjectId.isValid(productID))
      return res.status(400).json({ msg: "Invalid Product Id" })

    const cart = await Cart.findOne({ user: userId })

    if (!cart) return res.status(404).json({ msg: "No Cart Found" })

    const savedItem = cart.savedForLater.find(item => item._id.toString() === productID)
    if (!savedItem) return res.status(404).json({ msg: "Product not in saved list" })

    cart.savedForLater = cart.savedForLater.filter(item => item._id.toString() !== productID)

    cart.products.push({
      product: savedItem.product,
      quantity: savedItem.quantity || 1
    })

    await cart.save()
    await cart.populate("products.product", "name price image")

    res.status(200).json({ msg: "Product added to cart", cart: cart.products })
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

module.exports = {
  getCart,
  addProductToCart,
  updateQuantity,
  removeProduct,
  clearCart,
  deleteCart,
  getCartTotal,
  saveForLater,
  getSavedForLater,
  removeSaveForLater,
  clearSaved,
  addFromSaved
}

