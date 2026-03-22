const Product = require("../model/product");
const CouponCode = require("../model/couponCode");
const ErrorHandler = require("./ErrorHandler");

/**
 * Build authoritative cart lines and totals from DB (never trust client prices).
 * @param {Array<{ _id?: string, id?: string, qty: number }>} lineItems
 * @param {string} [couponName] - optional coupon code name
 */
async function buildOrderFromCartLines(lineItems, couponName) {
  if (!Array.isArray(lineItems) || lineItems.length === 0) {
    throw new ErrorHandler("Cart is empty", 400);
  }

  const cart = [];
  let subTotal = 0;

  for (const line of lineItems) {
    const productId = line._id || line.id;
    const qty = Number(line.qty);
    if (!productId || !Number.isFinite(qty) || qty < 1) {
      throw new ErrorHandler("Invalid cart line: product id and positive qty required", 400);
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new ErrorHandler(`Product not found: ${productId}`, 400);
    }
    if (product.stock < qty) {
      throw new ErrorHandler(`Insufficient stock for ${product.name}`, 400);
    }

    const clientShopId = line.shopId != null ? String(line.shopId) : null;
    if (clientShopId && String(product.shopId) !== clientShopId) {
      throw new ErrorHandler("Cart item does not match product shop", 400);
    }

    const lineTotal = product.discountPrice * qty;
    subTotal += lineTotal;

    cart.push({
      _id: product._id,
      name: product.name,
      category: product.category,
      discountPrice: product.discountPrice,
      qty,
      shopId: product.shopId,
      shop: product.shop,
      images: product.images,
    });
  }

  const shipping = subTotal * 0.01;
  let discountAmount = 0;

  if (couponName && String(couponName).trim()) {
    const coupon = await CouponCode.findOne({
      name: String(couponName).trim(),
    });
    if (!coupon) {
      throw new ErrorHandler("Invalid or expired coupon code", 400);
    }
    const eligibleItems = cart.filter((i) => String(i.shopId) === String(coupon.shopId));
    if (eligibleItems.length === 0) {
      throw new ErrorHandler("Coupon is not valid for items in this cart", 400);
    }
    const eligibleSubtotal = eligibleItems.reduce(
      (acc, i) => acc + i.discountPrice * i.qty,
      0
    );
    discountAmount = (eligibleSubtotal * coupon.value) / 100;
  }

  const totalPrice = Number((subTotal + shipping - discountAmount).toFixed(2));
  if (totalPrice < 0) {
    throw new ErrorHandler("Invalid order total", 400);
  }

  return {
    cart,
    subTotalPrice: Number(subTotal.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    discountPrice: Number(discountAmount.toFixed(2)),
    totalPrice,
  };
}

/**
 * Stripe amount in minor units (paisa for PKR).
 */
function stripeAmountFromTotal(totalPrice) {
  return Math.round(Number(totalPrice) * 100);
}

module.exports = { buildOrderFromCartLines, stripeAmountFromTotal };
