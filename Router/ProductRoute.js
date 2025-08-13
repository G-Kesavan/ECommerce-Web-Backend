const express = require('express')
const { getAllProduct, postNewProduct, getSingleProduct, upDateProduct, deleteProduct } = require('../Controllers/productController')
const router = express.Router()

router.route('/get-all-product').get(getAllProduct)
router.route('/create-new-product').post(postNewProduct)
router.route('/product/:id')
                            .get(getSingleProduct)
                            .put(upDateProduct) 
                            .delete(deleteProduct)

module.exports = router