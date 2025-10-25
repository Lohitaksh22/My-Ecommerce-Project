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
const PORT = process.env.PORT || 5000
const Stripe = require('stripe')

connectDB()

app.use(cookieParser())
app.use(express.json())

const cors = require('cors')
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'https://my-ecommerce-project-react-1.onrender.com'], credentials: true }))

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { items, shippingAddress, deliveryTime } = req.body
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map(item => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),

      success_url: "https://my-ecommerce-project-react-1.onrender.com/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://my-ecommerce-project-react-1.onrender.com/cancel",
      metadata: {
        shippingAddress,
        deliveryTime,
      },
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error(err)
    res.status(500)
  }
})

app.get("/checkout-session", async (req, res) => {
  try {
    const { sessionId } = req.query
    if (!sessionId) {
      return res.status(400).json({ msg: "Missing session Id" })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
  
    res.json(session)
    
  } catch (err) {
    console.error(err)
    res.status(500)
  }
})

app.use('/account', accountRoutes)
app.use(verifyToken)

app.use('/products', productRoutes)
app.use('/admin', adminRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)
app.use('/reviews', reviewRoutes)



mongoose.connection.once('open', () => {
  console.log('Connected to Database')
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)

  })

})
