require('./cron/orderStatusUpdate')
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const productRoutes = require('./routes/productRoutes')
const accountRoutes = require('./routes/accountRoutes')
const adminRoutes = require('./routes/adminRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const cookieParser = require('cookie-parser')
const verifyToken = require('./middleware/verifyToken')
const app = express()
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cookieParser())
app.use(express.json());

const cors = require('cors')
app.use(cors({ origin: 'http://localhost:5174', credentials: true }))


app.use('/account', accountRoutes)
app.use(verifyToken)

app.use('/products', productRoutes)
app.use('/admin', adminRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)
app.use('/reviews', reviewRoutes)



mongoose.connection.once('open', () => {
  console.log('Connected to Database');
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)

  })

})
