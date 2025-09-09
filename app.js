const  express = require ('express')
const app = express()
const productsRoute = require('./Router/productRoute')
const authRoute = require('./Router/authRoute')
const orderRouter = require('./Router/orderRoute')
const catchError = require('./Middleware/catchError')
const cookieParser = require('cookie-parser')
const cors = require('cors')

//MIDDLE WARES
app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use('/products',productsRoute)
app.use('/user',authRoute)
app.use('/order',orderRouter) 

app.use(catchError)

module.exports = app