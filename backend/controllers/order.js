const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Order = require("../model/order");
const Product = require("../model/product");
const Shop = require("../model/shop");
const catchAsyncError = require("../middleware/catchAsyncError");
const { buildOrderFromCartLines, stripeAmountFromTotal } = require("../utils/orderPricing");
const { orderLimiter } = require("../middleware/rateLimits");
const { validateCreateOrder } = require("../middleware/validateOrder");

function orderUserPayload(userDoc) {
  if (!userDoc) return null;
  const u = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete u.password;
  return u;
}

function cartLineItemsFromBody(cart) {
  if (!Array.isArray(cart)) return [];
  return cart.map((item) => ({
    _id: item._id,
    id: item.id,
    qty: item.qty,
    shopId: item.shopId,
  }));
}

function sellerOwnsOrder(order, sellerId) {
  const sid = String(sellerId);
  return (
    order.cart &&
    order.cart.length > 0 &&
    order.cart.every((line) => String(line.shopId) === sid)
  );
}

// create new order (authenticated; totals from DB; user from session)
router.post(
  "/create-order",
  orderLimiter,
  isAuthenticated,
  ...validateCreateOrder,
  catchAsyncError(async (req, res, next) => {
    const { cart, shippingAddress, paymentInfo, couponName, stripeCheckoutSessionId } =
      req.body;

    if (!shippingAddress || typeof shippingAddress !== "object") {
      return next(new ErrorHandler("Shipping address is required", 400));
    }

    const lines = cartLineItemsFromBody(cart);
    const pricing = await buildOrderFromCartLines(
      lines,
      couponName || undefined
    );

    if (paymentInfo?.type === "Credit Card" && paymentInfo?.id) {
      if (!stripeCheckoutSessionId) {
        return next(new ErrorHandler("Invalid checkout session", 400));
      }
      if (!process.env.STRIPE_SECRET_KEY) {
        return next(new ErrorHandler("Payment service unavailable", 503));
      }
      const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
      const intent = await stripe.paymentIntents.retrieve(paymentInfo.id);
      if (intent.status !== "succeeded") {
        return next(new ErrorHandler("Payment not completed", 400));
      }
      if (String(intent.metadata.userId) !== String(req.user._id)) {
        return next(new ErrorHandler("Payment does not match this account", 403));
      }
      if (String(intent.metadata.sessionId) !== String(stripeCheckoutSessionId)) {
        return next(new ErrorHandler("Payment session mismatch", 400));
      }
      const expectedAmount = stripeAmountFromTotal(pricing.totalPrice);
      if (intent.amount !== expectedAmount) {
        return next(new ErrorHandler("Payment amount does not match order total", 400));
      }
    }

    const userPayload = orderUserPayload(req.user);

    const shopItemsMap = new Map();
    for (const item of pricing.cart) {
      const shopId = item.shopId;
      if (!shopItemsMap.has(shopId)) {
        shopItemsMap.set(shopId, []);
      }
      shopItemsMap.get(shopId).push(item);
    }

    const orders = [];
    const shopEntries = [...shopItemsMap.entries()];
    let allocated = 0;
    for (let i = 0; i < shopEntries.length; i++) {
      const [, items] = shopEntries[i];
      const shopSubtotal = items.reduce((s, it) => s + it.discountPrice * it.qty, 0);
      let shopTotal;
      if (i === shopEntries.length - 1) {
        shopTotal = Number((pricing.totalPrice - allocated).toFixed(2));
      } else {
        const ratio =
          pricing.subTotalPrice > 0 ? shopSubtotal / pricing.subTotalPrice : 0;
        const shopShipping = Number((pricing.shipping * ratio).toFixed(2));
        const shopDiscount = Number((pricing.discountPrice * ratio).toFixed(2));
        shopTotal = Number((shopSubtotal + shopShipping - shopDiscount).toFixed(2));
        allocated += shopTotal;
      }

      const order = await Order.create({
        cart: items,
        shippingAddress,
        user: userPayload,
        totalPrice: shopTotal,
        paymentInfo: paymentInfo || {},
      });
      orders.push(order);
    }

    res.status(201).json({
      success: true,
      orders,
    });
  })
);

// get all orders of user
router.get(
  "/get-all-orders/:userId",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    if (String(req.params.userId) !== String(req.user._id)) {
      return next(new ErrorHandler("Access denied", 403));
    }

    const orders = await Order.find({ "user._id": req.params.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  })
);

// get all orders of seller
router.get(
  "/get-seller-all-orders/:shopId",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    if (String(req.params.shopId) !== String(req.seller._id)) {
      return next(new ErrorHandler("Access denied", 403));
    }

    const orders = await Order.find({
      "cart.shopId": req.params.shopId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  })
);

// update order status for seller
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400));
    }

    if (!sellerOwnsOrder(order, req.seller._id)) {
      return next(new ErrorHandler("Access denied", 403));
    }

    if (req.body.status === "Transferred to delivery partner") {
      for (const o of order.cart) {
        const product = await Product.findById(o._id);
        if (product) {
          product.stock -= o.qty;
          product.sold_out += o.qty;
          await product.save({ validateBeforeSave: false });
        }
      }
    }

    order.status = req.body.status;

    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
      if (order.paymentInfo) {
        order.paymentInfo.status = "Succeeded";
      }
      const seller = await Shop.findById(req.seller.id);
      if (!seller) {
        return next(new ErrorHandler("Shop not found!", 500));
      }
      const serviceCharge = order.totalPrice * 0.1;
      seller.availableBalance = order.totalPrice - serviceCharge;
      await seller.save();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      order,
    });
  })
);

// give a refund -> user
router.put(
  "/order-refund/:id",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400));
    }

    const ownerId = order.user && order.user._id;
    if (!ownerId || String(ownerId) !== String(req.user._id)) {
      return next(new ErrorHandler("Access denied", 403));
    }

    order.status = req.body.status;

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      order,
      message: "Order Refund Request successfully!",
    });
  })
);

// accept the refund -> seller
router.put(
  "/order-refund-success/:id",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400));
    }

    if (!sellerOwnsOrder(order, req.seller._id)) {
      return next(new ErrorHandler("Access denied", 403));
    }

    order.status = req.body.status;

    await order.save();

    if (req.body.status === "Refund Success") {
      for (const o of order.cart) {
        const product = await Product.findById(o._id);
        if (product) {
          product.stock += o.qty;
          product.sold_out -= o.qty;
          await product.save({ validateBeforeSave: false });
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Refund processed successfully!",
    });
  })
);

// all orders --> for admin
router.get(
  "/admin-all-orders",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncError(async (req, res, next) => {
    const orders = await Order.find().sort({
      deliveredAt: -1,
      createdAt: -1,
    });
    res.status(201).json({
      success: true,
      orders,
    });
  })
);

module.exports = router;
