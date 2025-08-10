const express = require('express')
const { getAllProduct, newProduct, postNewProduct } = require('../Controllers/productController')
const router = express.Router()

router.route('/get-all-product').get(getAllProduct)
router.route('/create-new-product').post(postNewProduct)

module.exports = router