const rateLimit = require("express-rate-limit");

const windowMs = 15 * 60 * 1000;

exports.authLimiter = rateLimit({
  windowMs,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts, try again later" },
});

exports.strictAuthLimiter = rateLimit({
  windowMs,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts, try again later" },
});

exports.paymentLimiter = rateLimit({
  windowMs,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many payment requests, slow down" },
});

exports.orderLimiter = rateLimit({
  windowMs,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many order requests, slow down" },
});
