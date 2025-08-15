const  express = require ('express')
const productsRoute = require('./Router/ProductRoute')
const authRoute = require('./Router/authRoute')
const app = express()
const catchError = require('./Middleware/catchError')

app.use(express.json())
app.use('/products',productsRoute)
app.use('/user',authRoute)
app.use(catchError)

module.exports = app