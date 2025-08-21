const Products = require('../Model/productModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../Middleware/catchAsyncError')
const APIFeature = require('../utils/APIFeatures')

exports.getAllProduct = async (req,res,next) =>{
    const resPerPage = 2
    const apiFeature = new APIFeature(Products.find(),req.query).search().filter().pageinte(resPerPage)
    const products = await apiFeature.products;
    res.status(200).json({
        success : true,
        count:products.length,
        products
    })
}

exports.postNewProduct = catchAsyncError(async(req,res,next)=>{
    const product = await Products.create(req.body)
    res.status(201).json({
        success:true,
        product
    })
})

exports.getSingleProduct = async(req,res,next)=>{
    const product = await Products.findById(req.params.id);
    if(!product){
      return next(new ErrorHandler('Product not found',400))
    }
    res.status(201).json({
        success:true,
        product
    })
}

exports.upDateProduct = async(req,res,next)=>{
   
    const product = await Products.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    if(!product){
        return res.status(404).json({
            success:false,
            message:"Product not found"
        });
    }
    res.status(201).json({
        success:true,
        product:product
    })
}

exports.deleteProduct = async(req,res,next)=>{
    const product = await Products.findById(req.params.id);
    if(!product){
        return res.status(404).json({
            success:false,
            message:"Product not found"
        });
    }
    await Product.findByIdAndDelete(req.params.id)
    res.status(201).json({
        success:true,
        message:"deleted this product"
    })
}