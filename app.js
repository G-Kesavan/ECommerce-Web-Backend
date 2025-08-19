const  express = require ('express')
const productsRoute = require('./Router/productRoute')
const authRoute = require('./Router/authRoute')
const app = express()
const catchError = require('./Middleware/catchError')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())
app.use('/products',productsRoute)
app.use('/user',authRoute)
app.use(catchError)

module.exports = app