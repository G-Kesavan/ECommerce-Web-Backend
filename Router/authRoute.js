const express = require("express");
const path = require("path");
const {
  registerUser,
  loginUser,
  logOut,
  forgotPassword,
  resetPassword,
  getUserProfile,
  changePassword,
  updateProfile,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../Controllers/authController");
const router = express.Router();
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../Middleware/authenticate");
const multer = require("multer");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cd) {
      cd(null, path.join(__dirname, "..", "upload", "avatar"));
    },
    filename: function (req, file, cd) {
      cd(null, file.originalname = Math.random().toString().slice(2)+'.png');
    },
  }),
});

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logOut);
router.route("/password-forgot").post(forgotPassword);
router.route("/password-reset/:token").post(resetPassword);
router.route("/my-profile").get(isAuthenticatedUser, getUserProfile);
router.route("/password-change").put(isAuthenticatedUser, changePassword);
router
  .route("/profile-update")
  .put(upload.single("avatar"), isAuthenticatedUser, updateProfile);

router
  .route("/admin/get-all-users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
