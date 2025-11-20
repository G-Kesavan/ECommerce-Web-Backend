const express = require("express");
const {
  newOrder,
  updateOrder,
  getSingleOrder,
  myOrder,
  getAllOrders,
  deleteOrder,
} = require("../Controllers/orderController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../Middleware/authenticate");
const router = express.Router();

router.route("/new-order").post(isAuthenticatedUser, newOrder);
router.route("/my-order").get(isAuthenticatedUser, myOrder);
router.route("/get-single-order/:id").get(isAuthenticatedUser, getSingleOrder);
router
  .route("/admin/all-orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);
router
  .route("/admin/update-order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder);
router
  .route("/admin/delete-order/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
