const { default: mongoose } = require('mongoose');
const Account = require('../models/Account')
const Product = require('../models/Product')
const Order = require('../models/Order')
const Review = require('../models/Review')

const getAllAccounts = async (req, res) => {
  try {

    const foundAccounts = await Account.find();
    if (!foundAccounts || foundAccounts.length === 0) return res.status(404).json({ msg: "No accounts found" })

    return res.status(200).json({TotalAccounts: foundAccounts.length , Accounts: foundAccounts });

  } catch (err) {
    res.sendStatus(500);
  }
}

const findAccount = async (req, res) => {
  try {
    const { username, email } = req.body
    if (!username || !email) return res.status(400).json({ msg: "Invalid Credentials" })

    const foundAccount = await Account.findOne({ username, email })
    if (!foundAccount) return res.status(404).json({ msg: "User not found" })

    res.status(200).json(
      {
        msg: "Found User",
        Username: foundAccount.username,
        email: foundAccount.email,
        lastlogged: foundAccount.lastLogin
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
    const { name, price, description } = req.body
    if (!name || !price || !description) res.status(400).json({ msg: "Fill Required Fields" })

    let product = { name, price, description }

    if (req.body.images) product.images = req.body.images

    
    if (req.body.category) {
      if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
        return res.status(400).json({ msg: "Invalid Category ID" });
      }
      product.category = req.body.category;
    }


    const listedProduct = await Product.create(product)

    res.status(201).json({ msg: "Product Listed", listedProduct })

  } catch (err) {
    console.error(err)
    res.sendStatus(500)

  }
}

const updateProductListing = async (req, res) => {
  try {
    const productID = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productID)) {
      return res.status(400).json({ msg: "Invalid Product ID" });
    }

    const product = await Product.findById(productID);
    if (!product) return res.status(404).json({ msg: "Product Not Found" });


    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;

    if (req.body.category && mongoose.Types.ObjectId.isValid(req.body.category)) {
      product.category = req.body.category;
    }

    product.images = req.body.images || product.images;

   

    const savedProduct = await product.save();

    res.status(200).json({ msg: "Updated the Product", savedProduct });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

const deleteProductListing = async (req, res) => {
  try {
    const productID = req.params.id
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

const getAllProductListings = async (req, res) => {
  try {
    const allProducts = await Product.find()
    if (allProducts.length === 0) return res.status(400).json({ msg: "No Products Listed" })

    res.status(200).json({
      total: allProducts.length,
      products: allProducts
    })
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}


const getProductListing = async (req, res) => {
  try {
    const productID = req.params.id
    if(!mongoose.Types.ObjectId.isValid(productID)) return res.status(404).json({msg: "Invalid Product ID"})

    const product = await Product.findById(productID)
    if (!product) return res.status(400).json({ msg: "No Product Found" })

    res.status(200).json(product)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

const getAllOrders = async (req,res) => {
  try{
    const allOrders = await Order.find()

    if(allOrders.length === 0 ) return res.status(404).json({msg: "No Orders Created"})

    res.status(200).json({msg: "Orders Found", allOrders: allOrders})  
  }catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

const getTotalRevenue = async (req, res) => {
  try{
    const allOrders = await Order.find()
    if(allOrders.length === 0 ) return res.status(400).json({msg: "No Orders Created"})

    let total = 0

    allOrders.forEach((order) => {
      order.products.forEach((item) => {
        total += Number(item.price*item.quantity)
      })
    })

    res.status(200).json({msg: "Total Revenue:", total})


  }catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

const getAllReviews = async (req, res) => {
  try{
    const allReviews = await Review.find()
    .populate("user", "username")
    .populate("product", "name")

    if(allReviews.length===0) return res.status(404).json({msg: "No reviews for any product"})

    res.status(200).json({msg:"All Reviews", allReviews})  
  }catch(err){
    console.error(err)
    res.status(500)
    
  }
}


module.exports = {
  getAllAccounts,
  findAccount,
  promoteRoles,
  deleteAccount,
  createProductListing,
  updateProductListing,
  deleteProductListing,
  getAllProductListings,
  getProductListing,
  getAllOrders,
  getTotalRevenue,
  getAllReviews
}

