const express = require('express')
const { getAllProducts, addNewProduct, getProduct, updateProduct, deleteProduct, createReview, getReview, deleteReview } = require('../Controllers/productController')
const { isAuthenticatedUser, authorizeRoles } = require('../Middleware/authenticate')
const router = express.Router()

router.route('/get-products').get(getAllProducts)
router.route('/create-product').post(isAuthenticatedUser, authorizeRoles('admin'), addNewProduct)
router.route('/review')
                        .put(isAuthenticatedUser, createReview)
                        .delete(deleteReview)

router.route('/get-reviews').get(isAuthenticatedUser, getReview)
router.route('/product/:id')
                            .get(getProduct)
                            .put(updateProduct)
                            .delete(deleteProduct)

module.exports = router