const Cart = require('../models/Cart')
const Product = require('../models/Product')
const Account = require('../models/Account')
const { default: mongoose } = require('mongoose')


const getCart = async (req, res) => {
  try {
    const userId = req.user.id

    const cartProducts = await Cart.findOne({ user: userId })
      .populate('products.product', 'name price image')

    if (!cartProducts || cartProducts.products.length === 0) return res.status(404).json({ msg: "No Products in Cart" })

    res.status(200).json(cartProducts.products.map(item => ({
      id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      quantity: item.quantity
    })))

  } catch (err) {
    console.error(err)
    res.sendStatus(500)

  }
}

const addProductToCart = async (req, res) => {
  try {
    const userId = req.user.id 
    const { product, newquantity } = req.body 

    if (!product || !newquantity) {
      return res.status(400).json({ msg: "No product or quantity provided" }) 
    }


    let cart = await Cart.findOne({ user: userId }).populate(
      "products.product",
      "name price image"
    ) 


    if (!cart) {
      cart = new Cart({ user: userId, products: [] }) 
    }

    const existingProduct = cart.products.find(
      (item) => item.product._id.toString() === product
    ) 

    if (existingProduct) {

      existingProduct.quantity += newquantity 
    } else {

      cart.products.push({ product, quantity: newquantity }) 
    }


    await cart.save() 


    await cart.populate("products.product", "name price image") 


    res.status(200).json(
      cart.products.map((item) => ({
        id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        quantity: item.quantity,
      }))
    ) 
  } catch (err) {
    console.error(err) 
    res.sendStatus(500) 
  }
} 

const updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id 

    
    const foundCart = await Cart.findOne({ user: userId }).populate("products.product", "name price image") 
    if (!foundCart) return res.status(404).json({ msg: "Add Products First" }) 

    const productID = req.params.id 
    if (!mongoose.Types.ObjectId.isValid(productID)) return res.status(404).json({ msg: "Invalid Product ID" }) 

    
    const foundProduct = foundCart.products.find(
      (item) => item.product._id.toString() === productID
    ) 
    if (!foundProduct) return res.status(404).json({ msg: "Product not in cart" }) 

    const { inc, dec, set } = req.query 

    if (inc) foundProduct.quantity += Number(inc) 
    if (dec) foundProduct.quantity -= Number(dec) 
    if (set) foundProduct.quantity = Number(set) 

 
    if (foundProduct.quantity <= 0) {
      foundCart.products = foundCart.products.filter(
        (item) => item.product._id.toString() !== productID
      ) 
    }

    await foundCart.save() 

    res.status(200).json({
      msg: "Updated Product",
      cart: foundCart.products.map((item) => ({
        id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        quantity: item.quantity,
      })),
    }) 
  } catch (err) {
    console.error(err) 
    res.sendStatus(500) 
  }
}

const removeProduct = async (req, res) => {
  try{
    const userId = req.user.id

    const productID = req.params.id
    if(!mongoose.Types.ObjectId.isValid(productID)) return res.status(400).json({msg: "Invalid Product Id"})

    const foundCart = await Cart.findOne({user:userId, "products.product":productID}).populate('products.product')  
    if(!foundCart) return res.status(404).json({msg: "Add Product First"})

    const foundProduct = foundCart.products.find((item) => {
      item.product._id.toString() === productID
    })
    
    if(!foundProduct) res.status(404).json({msg: "Product Not Found"})

    foundCart.products = foundCart.products.filter((item) => { item.product._id.toString() != productID}) 

    await foundCart.save()

    res.status(200).json({msg: "Product has been deleted", product: foundProduct} )

  }catch (err) {
    console.error(err) 
    res.sendStatus(500) 
  }
}

const clearCart = async (req, res) => {
  try{
    const userId = req.user.id

    const foundCart = await Cart.findOne({user: userId})
    if(!foundCart) return res.status(404).json({msg: "No Cart Found"})
    
    foundCart.products = []
    await foundCart.save()
    
    res.status(200).json({msg: "Cart has been cleared", foundCart})

  }catch (err) {
    console.error(err) 
    res.sendStatus(500) 
  }
}

const deleteCart = async (req, res) => {
  try{
    const userId = req.user.id

    const foundCart = await Cart.findOne({user: userId})
    if(!foundCart) return res.status(404).json({msg: "No Cart Found"})
    
    await foundCart.deleteOne()
    
    res.status(200).json({msg: "Cart has been deleted", foundCart})

  }catch (err) {
    console.error(err) 
    res.sendStatus(500) 
  }
}

const getCartTotal = async (req, res) => {
  try{
    const userId = req.user.id
    const foundCart = await Cart.findOne({user: userId}).populate('products.product', 'price')
    if(!foundCart) return res.status(404).json({msg: "Cart Not Found"})

    let total = 0
    
    foundCart.products.forEach((item) => {total += Number(item.product.price * item.quantity)})

    res.status(200).json({msg: `Cart Total is ${total}`})


  }catch (err) {
    console.error(err) 
    res.sendStatus(500) 
  }
}

const saveForLater = async (req, res) => {
  try {
    const productToSaveID = req.params.id

    if (!mongoose.Types.ObjectId.isValid(productToSaveID))
      return res.status(400).json({ msg: "Invalid Product Id" })

    const foundCart = await Cart.findOne({ user: req.user.id })
    if (!foundCart) return res.status(404).json({ msg: "No Cart Found" })

    
    const productInCart = foundCart.products.find(
      (item) => item.product.toString() === productToSaveID
    )
    if (!productInCart)
      return res.status(404).json({ msg: "Product Not in Cart" })

    
    foundCart.products = foundCart.products.filter(
      (item) => item.product.toString() !== productToSaveID
    )

    
    foundCart.savedForLater.push({
      product: productToSaveID,
      quantity: productInCart.quantity
    })

    await foundCart.save()

    res.status(200).json({ msg: "Product saved for later", cart: foundCart })
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
  saveForLater
}