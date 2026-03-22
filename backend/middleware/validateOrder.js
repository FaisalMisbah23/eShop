const { body, validationResult } = require("express-validator");
const ErrorHandler = require("../utils/ErrorHandler");

function cartLinesOk(cart) {
  if (!Array.isArray(cart) || cart.length === 0) {
    throw new Error("cart must be a non-empty array");
  }
  for (const line of cart) {
    const id = line._id || line.id;
    const qty = Number(line.qty);
    if (!id) {
      throw new Error("Each cart line needs a product id");
    }
    if (!Number.isFinite(qty) || qty < 1) {
      throw new Error("Each cart line needs qty >= 1");
    }
  }
  return true;
}

exports.validateCreateOrder = [
  body("shippingAddress").isObject().withMessage("shippingAddress required"),
  body("cart").custom(cartLinesOk),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new ErrorHandler(errors.array().map((e) => e.msg).join(", "), 400)
      );
    }
    next();
  },
];

exports.validatePaymentIntent = [
  body("cart").custom(cartLinesOk),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new ErrorHandler(errors.array().map((e) => e.msg).join(", "), 400)
      );
    }
    next();
  },
];
