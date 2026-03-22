const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Shop = require("../model/shop");

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!decodedToken || !decodedToken.id) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  req.user = user;
  next();
});

exports.isSeller = catchAsyncError(async (req, res, next) => {
  const { seller_token } = req.cookies;

  if (!seller_token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);
  if (!decoded || !decoded.id) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  const seller = await Shop.findById(decoded.id);
  if (!seller) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  req.seller = seller;
  next();
});

exports.isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user?.role || "User"} can not access this resources!`,
          403
        )
      );
    }
    next();
  };
};
