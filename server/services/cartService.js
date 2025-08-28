const Cart = require('../models/Cart')

const getCart = async (userId) => {
  const foundCart = await Cart.findOne({user: userId}).populate('products.product', 'name price image')
  return foundCart
}

const total = (cart) => {
  let total = 0
  cart.products.forEach((item) => {
    total += item.product.price* item.quantity
  })
  return total
}

const clearCart = async (cart) => {
  cart.products = []
  await cart.save()
}

const mapProductsForOrder = (cart) => {
  return cart.products.map(item => ({
    productId: item.product._id,
    name: item.product.name,
    price: item.product.price,
    image: item.product.image,
    quantity: item.quantity
  }))
}

module.exports = {getCart, total, clearCart, mapProductsForOrder}