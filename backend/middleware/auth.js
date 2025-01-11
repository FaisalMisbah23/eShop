const ErrorHandler = require("../utlis/ErrorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../model/user");


exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodedToken) {
        return next(new ErrorHandler("Please login to continue", 400));
    }
    req.user = await User.findById(decodedToken.id);
    next();
})