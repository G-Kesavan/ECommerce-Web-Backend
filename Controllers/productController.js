const Products = require('../Model/productModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../Middleware/catchAsyncError')
const APIFeature = require('../utils/APIFeatures')

exports.getAllProducts = async (req,res,next) =>{
    const resPerPage = 3
    const apiFeature = new APIFeature(Products.find(),req.query).search().filter().pageinte(resPerPage)
    const products = await apiFeature.products;
    res.status(200).json({
        success : true,
        count:products.length,
        products
    })
}

exports.addNewProduct = catchAsyncError(async(req,res,next)=>{
    req.body.user= req.user.id
    const product = await Products.create(req.body)
    res.status(201).json({
        success:true,
        product
    })
})

exports.getProduct = async(req,res,next)=>{
    const product = await Products.findById(req.params.id);
    if(!product){
      return next(new ErrorHandler('Product not found',400))
    }
    res.status(201).json({
        success:true,
        product
    })
}

exports.updateProduct = async(req,res,next)=>{
   
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
    await Products.findByIdAndDelete(req.params.id)
    res.status(201).json({
        success:true,
        message:"Deleted this product"
    })
}

exports.createReview = catchAsyncError(async(req,res,next)=>{
    const {productId, rating, comment} = req.body

    const review = {user : req.user.id, rating, comment}

    const product = await Products.findById(productId)

    const isReviewed = product.reviews.find( review => {
        return review.user.toString() == req.user.id.toString()
    })
    
    if(isReviewed){
        product.reviews.forEach(review=>{
            if(review.user.toString() == req.user.id.toString()){
                review.comment = comment
                review.rating = rating
            }
        })
    }else{
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length;
    }

    product.ratings = product.reviews.reduce((acc,review)=>{
        return review.rating + acc;
    },0) / product.reviews.length;
    product.ratings = isNaN(product.ratings)?0:product.ratings

    await product.save({validateBeforeSave:false})

    res.status(201).json({
        success:true,
    })
})


exports.getReview= catchAsyncError(async(req,res,next)=>{
    const product = await Products.findById(req.query.id)
    res.status(200).json({
        success:true,
        review:product.reviews
    })
})

exports.deleteReview= catchAsyncError(async(req,res,next)=>{
    const product = await Products.findById(req.query.productId)
    const reviews = product.reviews.filter(review=>{
        return review._id.toString() !== req.query.id.toString()
    })
    const numOfReviews = reviews.length
    let ratings =  product.reviews.reduce((acc,review)=>{
        return review.rating + acc;
    },0) / reviews.length;

    ratings = isNaN(ratings)?0:ratings

    await Products.findByIdAndUpdate(req.query.productId,{
        reviews,
        numOfReviews,
        ratings
    })

    res.status(200).json({
        success:true,
    })
})
