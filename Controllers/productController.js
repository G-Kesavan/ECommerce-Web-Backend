const Product = require('../Model/product.model')
exports.getAllProduct = async (req,res,next) =>{
    const products = await Product.find()
    res.status(200).json({
        success : true,
        count:products.length,
        products
    })
}

exports.postNewProduct = async(req,res,next)=>{
    const product = await Product.create(req.body)
    res.status(201).json({
        success:true,
        product
    })
}