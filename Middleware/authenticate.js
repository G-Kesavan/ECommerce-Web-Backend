const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("login first to handle this resource", 401));
  }

  const deCoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  if (!deCoded.id) {
    return next(new ErrorHandler("Invalid token or Token is expired", 401));
  }

  req.user = await User.findById(deCoded.id);

  next();
});

exports.checkAuthCookie = (req, res, next) => {
  if (!req.cookies.token) {
    return next(new ErrorHandler("User is not login...", 401));
  }
  next();
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`Role ${req.user.role} is not allowed `, 401)
      );
    }
    next();
  };
};
