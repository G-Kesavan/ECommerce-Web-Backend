const catchAsyncError = require("../Middleware/catchAsyncError");
const User = require("../Model/userModel");
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require("../utils/jwt");

exports.registerUser = catchAsyncError(async (req,res,next)=>{
    const {name,email,password,avater}=req.body
    const user = await User.create({
        name,
        email,
        password,
        avater
    })

    sendToken(user,200,res)
})

exports.loginUser = catchAsyncError( async (req,res,next)=>{
    const {email,password} = req.body

    if(!email || !password){
        return next(new ErrorHandler('Please enter email & password',400))
    }

    const user = await User.findOne({email}).select('+password')

    if(!user){
        return next(new ErrorHandler(' Invalid email and password '))
    }

    if(!await user.isValidPassword(password)){
        return next(new ErrorHandler(' Invalid email and password '))
    }

    sendToken(user,200,res)
})