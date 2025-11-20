const express = require("express");
const path = require("path");
const {
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getReview,
  deleteReview,
  getAllProducts,
  createProduct,
} = require("../Controllers/productController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../Middleware/authenticate");
const multer = require("multer");
const router = express.Router();
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cd) {
      cd(null, path.join(__dirname, "..", "upload", "products"));
    },
    filename: function (req, file, cd) {
      cd(
        null,
        (file.originalname = Math.random().toString().slice(2) + ".png")
      );
    },
  }),
});

router.route("/get-products").get(getProducts);
router.route("/product/:id").get(getProduct);
router.route("/review").put(isAuthenticatedUser, createReview);

router
  .route("/admin/create-product")
  .post(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    upload.array("images"),
    createProduct
  );
router
  .route("/admin/get-all-product")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllProducts);
router
  .route("/admin/product/:id")
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    upload.array("images"),
    updateProduct
  )
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
router
  .route("/admin/reviews")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview)
  .get(isAuthenticatedUser, authorizeRoles("admin"), getReview);

module.exports = router;
