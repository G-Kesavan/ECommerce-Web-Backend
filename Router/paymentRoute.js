const express = require("express");
const {
  createPayment,
  verifyPayment,
} = require("../Controllers/paymentControllers");
const { isAuthenticatedUser } = require("../Middleware/authenticate");
const router = express.Router();

router.route("/create-order").post(isAuthenticatedUser, createPayment);
router.route("/verify").post(isAuthenticatedUser, verifyPayment);

module.exports = router;
