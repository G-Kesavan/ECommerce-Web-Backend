const catchAsyncError = require("../Middleware/catchAsyncError");
const User = require("../Model/userModel");

exports.registerUser = catchAsyncError(async (req,res,next)=>{
    const {name,email,password,avater}=req.body
    const user = await User.create({
        name,
        email,
        password,
        avater
    })
    res.status(201).json({
        success:true,
        user
    })
})