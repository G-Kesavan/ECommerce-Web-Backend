const  express = require ('express')
const products = require('./Router/ProductRoute')
const app = express()

app.use(express.json())
app.use('/products',products)

module.exports = app