const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Pleace enter the Name.']
    },
    email:{
        type:String,
        required:[true,'Pleace enter the email.'],
        unique:true,
        validate:[validator.isEmail,'Pleace enter the valied email.']
    },
    password:{
        type:String,
        required:[true,'Pleace enter the password.'],
        maxLength:[12,'Pleace cannot exceed 12 characters'],
        minLength:[6,'Pleace enter minuame 6 characters']
    },
    avater:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:'user'
    },
    resetPasswordToken:String,
    resetPasswordTokenExpire:Date,
    createdAt:{
        type:Date,
        default:Date.now
    }
})

userSchema.pre('save',async function (next){
    this.password = await bcrypt.hash(this.password,10)
})

let model = mongoose.model('User',userSchema)

module.exports = model;