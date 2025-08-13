const express = require('express')
const { registerUser } = require('../Controllers/authControllers')
const router = express.Router()

router.route('/register').post(registerUser)


module.exports = router