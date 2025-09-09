const express = require('express')
const { registerUser,loginUser, logOut, forgotPassword, resetPassword, getUserProfile, changePassword, updateProfile, getAllUser, getUser, updateUser, deleteUser } = require('../Controllers/authController')
const router = express.Router()
const {isAuthenticatedUser, authorizeRoles} = require('../Middleware/authenticate')
const { updateOne } = require('../Model/userModel')

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logOut)
router.route('/password-forgot').post(forgotPassword)
router.route('/password-reset/:token').post(resetPassword)
router.route('/myprofile').get(isAuthenticatedUser,getUserProfile)
router.route('/password-change').put(isAuthenticatedUser,changePassword)
router.route('/update').put(isAuthenticatedUser,updateProfile)  

router.route('/admin/get-all-users').get(isAuthenticatedUser,authorizeRoles('admin'),getAllUser)
router.route('/admin/user/:id').get(isAuthenticatedUser,authorizeRoles('admin'),getUser) 
                                .put(isAuthenticatedUser,authorizeRoles('admin'),updateUser) 
                                .delete(isAuthenticatedUser,authorizeRoles('admin'),deleteUser) 

module.exports = router