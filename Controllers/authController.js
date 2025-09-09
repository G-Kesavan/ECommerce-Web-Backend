const catchAsyncError = require("../Middleware/catchAsyncError");
const User = require("../Model/userModel");
const sendEmail = require("../utils/emailSend");
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require("../utils/jwt");
const crypto = require("crypto")

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

exports.logOut = (req,res,next) => {
    res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly:true
    })
    .status(200)
    .json({
        success:true,
        message:"loggedout"
    })
}

exports.forgotPassword = catchAsyncError( async (req,res,next)=>{
    const user = await User.findOne({email:req.body.email})

    if(!user) {
        return next(new ErrorHandler('User not found with this email',404))
    }

    const resetToken = user.getRestToken()
    await user.save({validateBeforeSave:false})

    const resetUrl = `${req.protocol}://${req.get('host')}/user/password-reset/${resetToken}`

    const message = `Your password reset url is as follows \n\n ${resetUrl} \n\n if you have not requseted this email`

    try{
        sendEmail({
            email:user.email,
            subject:"Ecommerce web password rest",
            message
        })

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email}`
        })
    }
    catch(error){
        user.resetPasswordToken = undefined
        user.resetPasswordTokenExpire = undefined
        await user.save({validateBeforeSave:false})
        return next(new ErrorHandler(error.message,500))
    }

} )

exports.resetPassword = catchAsyncError( async (req,res,next)=>{
   const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

   const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: {
            $gt : Date.now()
        }
   })

   if(!user){
        return next(new ErrorHandler('password reset token is expired',))
   }

   if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('password is doset not match'))
   }

   user.password = req.body.password
   user.resetPasswordToken = undefined
   user.resetPasswordTokenExpire = undefined
   await user.save({validateBeforeSave:false})

   sendToken(user,201,res)
})

//get user profile

exports.getUserProfile = catchAsyncError(async (req,res,next)=>{
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success:true,
        user
    })
})

exports.changePassword = catchAsyncError(async (req,res,next)=>{
    const user = await User.findById(req.user.id).select('+password');
    if(!await user.isValidPassword(req.body.oldPassword)){
        return next(new ErrorHandler('old password is incorrect',401))
    }

    user.password = req.body.password
    await user.save()
    res.status(200).json({
        success:true,
        message:"password is changed"
    })
})

exports.updateProfile = catchAsyncError(async (req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
    }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true
    })

    res.status(200).json({
        success:true,
        user,
        message:"User data update"
    })
}) 


//Admin : Get All Users -
exports.getAllUser = catchAsyncError(async(req,res,next)=>{
    const users = await User.find();
    res.status(200).json({
        success:true,
        users
    })
})

//Admin : Get Specific User -
exports.getUser = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(ErrorHandler('User not found with this id'))
    }
    res.status(200).json({
        success:true,
        user
    })
})

//Admin : Get Update User -
exports.updateUser = catchAsyncError(async(req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }
    const user = await User.findByIdAndUpdate(req.params.id,newUserData);

    if(!user){
        return next(ErrorHandler('User not found with this id'))
    }
    res.status(200).json({
        success:true,
        user
    })
})

//Admin : Get Delete User -
exports.deleteUser = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(ErrorHandler('User not found with this id'))
    }
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({
        success:true,
    })
})