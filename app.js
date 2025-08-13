const  express = require ('express')
const productsRoute = require('./Router/ProductRoute')
const authRoute = require('./Router/authRoute')
const app = express()
const error = require('./Middleware/error')

app.use(express.json())
app.use('/products',productsRoute)
app.use('/user',authRoute)
app.use(error)

module.exports = app