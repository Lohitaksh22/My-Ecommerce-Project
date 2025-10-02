const { default: mongoose } = require('mongoose');
const Account = require('../models/Account')
const Product = require('../models/Product')
const Order = require('../models/Order')
const Review = require('../models/Review')
const Category = require("../models/Category")

const findAccount = async (req, res) => {
  try {
    const keyword = req.query.keyword || ""
    const sortOption = req.query.sort || ""

    let sort = {}

    const filter = {
      $or: [
        { username: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { roles: { $regex: keyword, $options: "i" } }

      ]
    }
    if (sortOption === "newest") sort = { createdAt: -1 }
    else if (sortOption === "oldest") sort = { createdAt: 1 }
    else if (sortOption === "Admin") filter.roles = "Admin"
    else if (sortOption === "User") filter.sort = "User"

    const foundAccounts = await Account.find(filter).sort(sort)
    if (foundAccounts.length === 0) return res.status(404).json({ msg: "User(s) not found" })

    res.status(200).json({
      accounts: foundAccounts,
      length: foundAccounts.length

    }
    )



  } catch (err) {
    res.sendStatus(500)
  }

}

const promoteRoles = async (req, res) => {
  try {
    const { username, email } = req.body
    if (!username || !email) return res.status(400).json({ msg: "Invalid Credentials" })

    const foundAccount = await Account.findOne({ username, email })
    if (!foundAccount) return res.status(404).json({ msg: "User not found" })

    const role = foundAccount.roles
    if (role === "Admin") return res.status(409).json({ msg: "Already Admin" })

    foundAccount.roles = "Admin"
    await foundAccount.save()

    res.status(200).json(
      {
        msg: "Promoted User",
        Username: foundAccount.username,
        email: foundAccount.email,
        lastlogged: foundAccount.lastLogin,
        Role: foundAccount.roles
      }
    )



  } catch (err) {
    res.sendStatus(500)
  }

}


const deleteAccount = async (req, res) => {
  try {
    const { username, email } = req.body
    if (!username || !email) return res.status(400).json({ msg: "Invalid Credentials" })

    const foundAccount = await Account.findOne({ username, email })
    if (!foundAccount) return res.status(404).json({ msg: "User not found" })

    await foundAccount.deleteOne()

    res.status(200).json({ msg: `${username} has been deleted` })



  } catch (err) {
    res.sendStatus(500)
  }
}



const createProductListing = async (req, res) => {
  try {
    const { name, price, description, image, category } = req.body
    if (!name || !price || !description || !image || !category) return res.status(400).json({ msg: "Fill Required Fields" })

    let product = { name, price, description, image }

    const cat = await Category.findOne({ name: category })
    if (!cat) return res.status(404).json({ msg: "Not Valid Category" })

    product.category = cat

    const listedProduct = await Product.create(product)

    res.status(201).json({ msg: "Product Listed", listedProduct })

  } catch (err) {
    console.error(err)
    res.sendStatus(500)

  }
}

const updateProductListing = async (req, res) => {
  try {
    const productID = req.body.id;
    if (!mongoose.Types.ObjectId.isValid(productID)) {
      return res.status(400).json({ msg: "Invalid Product ID" });
    }

    const product = await Product.findById(productID);
    if (!product) return res.status(404).json({ msg: "Product Not Found" });


    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;

    if (req.body.category) {
      const cat = await Category.findOne({ name: req.body.category })
      if (!cat) return res.status(404).json({ msg: "Invalid Category Name" })
      product.category = req.body.category;
    }

    product.image = req.body.image || product.image;



    const savedProduct = await product.save();

    res.status(200).json({ msg: "Updated the Product", savedProduct });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

const deleteProductListing = async (req, res) => {
  try {
    const productID = req.query.id
    if (!mongoose.Types.ObjectId.isValid(productID)) return res.status(404).json({ msg: "Invalid Product ID" })

    const product = await Product.findById(productID)
    if (!product) return res.status(404).json({ msg: "Product Not Found" })

    await product.deleteOne()

    res.status(200).json({ msg: "Product has been deleted", product })
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}


const getAllMatchingProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword || ""
    const categoryName = req.query.category || null
    const priceMin = req.query.min || 0
    const priceMax = req.query.max || Number.MAX_SAFE_INTEGER
    const sortOption = req.query.sort || ""

    let sort = {}

    const filter = {
      $or: [{ name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } }],

      price: { $lte: priceMax, $gte: priceMin },

    }

    if (categoryName) {
      const cat = await Category.findOne({ name: categoryName });
      if (cat) filter.category = cat._id
      else filter.category = null
    }

    if (sortOption === "priceAsc") sort = { price: 1 }
    else if (sortOption === "priceDesc") sort = { price: -1 }
    else if (sortOption === "newest") sort = { dateAdded: -1 }
    else if (sortOption === "oldest") sort = { dateAdded: 1 }
    else if (sortOption === "numberOfRatingsAsc") sort = { 'numReviews': 1 }
    else if (sortOption === "numberOfRatingsDesc") sort = { 'numReviews': -1 }



    const allProducts = await Product.find(filter).populate('category').sort(sort)
    if (allProducts.length === 0) return res.status(200).json({ msg: "No Products Listed" })



    res.status(200).json(allProducts)

  } catch (err) {
    console.log(err)
    res.sendStatus(500)

  }
}

const getAllOrders = async (req, res) => {
  try {
    const keyword = req.query.keyword || ""
    const sortOption = req.query.sort || ""
    const priceMin = req.query.min || 0
    const priceMax = req.query.max || Number.MAX_SAFE_INTEGER
    const orderStatus = req.query.orderStatus || ""
    const paymentStatus = req.query.paymentStatus || ""
    const filter = {
      price: { $lte: priceMax, $gte: priceMin },

      $or: [

      ]
    }

    if (orderStatus) filter.orderStatus = orderStatus
    if (paymentStatus) filter.paymentStatus = paymentStatus

    const users = await Account.find({ username: { $regex: keyword, $options: "i" } })
    if (users.length > 0) {
      filter.$or.push({ user: { $in: users.map(a => a._id) } })

    }

    filter.$or.push({ "products.name": { $regex: keyword, $options: "i" } })

    let sort = {}

    if (sortOption === "priceAsc") sort = { price: 1 }
    else if (sortOption === "priceDesc") sort = { price: -1 }
    else if (sortOption === "newest") sort = { createdAt: -1 }
    else if (sortOption === "oldest") sort = { createdAt: 1 }

    if (filter.$or.length === 0) {
      delete filter.$or
    }
    const allOrders = await Order.find(filter).populate("products user").sort(sort)

    if (allOrders.length === 0) return res.status(404).json({ msg: "No Orders Created" })



    res.status(200).json({ msg: allOrders.length, allOrders: allOrders })

  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

const getTotalRevenue = async (req, res) => {
  try {
    const allOrders = await Order.find()
    if (allOrders.length === 0) return res.status(400).json({ msg: "No Orders Created" })

    let total = 0

    allOrders.forEach((order) => {
      order.products.forEach((item) => {
        total += Number(item.price * item.quantity)
      })
    })

    res.status(200).json({ msg: "Total Revenue:", total })


  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

const getAllReviews = async (req, res) => {
  try {
    const sortOption = req.query.sort || ""
    const keyword = req.query.keyword || ""
    const stars = req.query.stars || null
    const filter = {
      $or: [
        { review: { $regex: keyword, $options: "i" } },

      ]
    }

    const accounts = await Account.find({ username: { $regex: keyword, $options: "i" } })
    if (accounts.length > 0) {
      filter.$or.push({ user: { $in: accounts.map(a => a._id) } })

    }

    const products = await Product.find({ name: { $regex: keyword, $options: "i" } }).select("_id");
    if (products.length > 0) {
      filter.$or.push({ product: { $in: products.map(p => p._id) } })

    }

    if (stars) filter.stars = Number(stars)

    let sort = {}

    if (sortOption === "newest") sort = { createdAt: -1 }
    else if (sortOption === "oldest") sort = { createdAt: 1 }


    const allReviews = await Review.find(filter)
      .populate("user", "username")
      .populate("product", "name")
      .sort(sort)

    if (allReviews.length === 0) return res.status(404).json({ msg: "No reviews for any product" })

    res.status(200).json({ msg: `${allReviews.length} Reviews Found`, allReviews })
  } catch (err) {
    console.error(err)
    res.status(500)

  }
}


module.exports = {
  findAccount,
  promoteRoles,
  deleteAccount,
  createProductListing,
  updateProductListing,
  deleteProductListing,
  getAllMatchingProducts,
  getAllOrders,
  getTotalRevenue,
  getAllReviews
}

