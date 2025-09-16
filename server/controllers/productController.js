const Product = require('../models/Product')
const Category = require('../models/Category')


const getAllMatchingProducts = async (req, res) => {
  try{
    const keyword = req.query.keyword || ""
    const category = req.query.category || null
    const priceMin = req.query.min || 0
    const priceMax= req.query.max || Number.MAX_SAFE_INTEGER
    const minRating = req.body.stars || 0
    const sortOption = req.query.sort || ""

   let sort = {}

    const filter = {
        $or: [{name: {$regex: keyword, $options:"i"}},
        {description: {$regex: keyword, $options:"i"}}],

        price: {$lte: priceMax, $gte: priceMin},
        'avgRating': {$gte: minRating}
    }

    if(category) filter.category= category

     if(sortOption === "priceAsc") sort = {price: 1}
     else if (sortOption === "priceDesc") sort = {price: -1}
     else if (sortOption ==="newest") sort = {dateAdded: -1}
     else if (sortOption === "oldest") sort = {dateAdded: 1}
     else if (sortOption === "numberOfRatingsAsc") sort = {'numReviews': 1}
     else if (sortOption === "numberOfRatingsDesc") sort = {'numReviews': -1}
   
     

    const allProducts = await Product.find(filter).populate('category').sort(sort)
    if(allProducts.length===0) return res.status(200).json({msg: "No Products Listed"})

    
    
    res.status(200).json(allProducts)  

  }catch(err){
    console.log(err)
    res.sendStatus(500)
    
  }
}

const getProduct = async (req, res) => {
  try{
    const productID = req.params.id
    if(!productID) return res.status(404).json({msg: "Please Enter Product ID"})

    const product = await Product.findById(productID).populate('category')
    if(!product) return res.status(404).json({msg: "Product Not Found"})
    
    res.status(200).json(product)  
    

  }catch(err){
    console.log(err)
    res.sendStatus(500)
  }
}

const getAllCategories = async (req,res) => {
  try{
    const categories = await Category.find()
    if(categories.length===0) return res.status(404).json({msg: "No Categories Found"})
    
    res.status(200).json(categories)  
  }catch(err){
    console.log(err)
    res.sendStatus(500)
  }
}

const getAllProductListing = async (req, res) => {
  try {
    // Get the keyword from query and trim spaces
    const keyword = (req.query.keyword || "").trim();
    console.log("Keyword received in backend:", `"${keyword}"`); // 🔥 Debug

    // Build filter only if keyword exists
    let filter = {};
    if (keyword) {
      filter = { name: { $regex: keyword, $options: "i" } };
      console.log("Filter applied:", filter); // 🔥 Debug
    } else {
      console.log("No keyword provided, returning all products"); // 🔥 Debug
    }

    // Query the database
    const products = await Product.find(filter).populate('category');
    console.log(`Products found: ${products.length}`); // 🔥 Debug
    products.forEach(p => console.log(" -", p.name)); // 🔥 Debug

    if (products.length === 0) {
      return res.status(404).json({ msg: "Product Not Found" });
    }

    res.status(200).json({
      total: products.length,
      products,
    });
  } catch (err) {
    console.error("Error in getAllProductListing:", err);
    res.sendStatus(500);
  }
};


module.exports = {getAllProductListing, getAllMatchingProducts, getProduct, getAllCategories}