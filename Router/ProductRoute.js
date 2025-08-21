const express = require('express')
const { getAllProduct, postNewProduct, getSingleProduct, upDateProduct, deleteProduct } = require('../Controllers/productController')
const { isAuthenticatedUser } = require('../Middleware/authenticate')
const router = express.Router()

router.route('/get-products').get(isAuthenticatedUser,getAllProduct)
router.route('/create-product').post(postNewProduct)
router.route('/product/:id')
                            .get(getSingleProduct)
                            .put(upDateProduct)
                            .delete(deleteProduct)

module.exports = router