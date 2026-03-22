const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const catchAsyncError = require("../middleware/catchAsyncError");
const { isAuthenticated } = require("../middleware/auth");
const {
  buildOrderFromCartLines,
  stripeAmountFromTotal,
} = require("../utils/orderPricing");
const ErrorHandler = require("../utils/ErrorHandler");
const { paymentLimiter } = require("../middleware/rateLimits");
const { validatePaymentIntent } = require("../middleware/validateOrder");

function cartLineItemsFromBody(cart) {
  if (!Array.isArray(cart)) return [];
  return cart.map((item) => ({
    _id: item._id,
    id: item.id,
    qty: item.qty,
    shopId: item.shopId,
  }));
}

router.post(
  "/create-payment-intent",
  paymentLimiter,
  isAuthenticated,
  ...validatePaymentIntent,
  catchAsyncError(async (req, res, next) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      return next(new ErrorHandler("Payment service unavailable", 503));
    }

    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const { cart, couponName } = req.body;
    const lines = cartLineItemsFromBody(cart);
    const pricing = await buildOrderFromCartLines(
      lines,
      couponName || undefined
    );

    const sessionId = crypto.randomUUID();
    const amount = stripeAmountFromTotal(pricing.totalPrice);

    const myPayment = await stripe.paymentIntents.create({
      amount,
      currency: "pkr",
      metadata: {
        userId: String(req.user._id),
        sessionId,
      },
      payment_method_types: ["card"],
    });

    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret,
      sessionId,
      amount,
    });
  })
);

/** @deprecated Use POST /create-payment-intent — amount is no longer accepted from client */
router.post(
  "/process",
  paymentLimiter,
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    return next(
      new ErrorHandler(
        "Use POST /api/v2/payment/create-payment-intent with your cart instead",
        400
      )
    );
  })
);

router.get(
  "/stripeapikey",
  catchAsyncError(async (req, res, next) => {
    const key = process.env.STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_API_KEY;
    if (!key) {
      return next(new ErrorHandler("Stripe publishable key not configured", 503));
    }
    res.status(200).json({ stripeApiKey: key });
  })
);

module.exports = router;
