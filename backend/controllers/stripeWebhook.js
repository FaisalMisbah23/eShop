const Order = require("../model/order");

/**
 * Raw body Stripe webhook — mounted before express.json in app.js
 */
module.exports = async function stripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !process.env.STRIPE_SECRET_KEY) {
    return res.status(503).send("Webhook not configured");
  }

  let event;
  try {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    try {
      await Order.updateMany(
        { "paymentInfo.id": intent.id },
        { $set: { "paymentInfo.status": "succeeded" } }
      );
    } catch (e) {
      // Non-fatal: order may be created after webhook fires
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object;
    try {
      await Order.updateMany(
        { "paymentInfo.id": intent.id },
        { $set: { "paymentInfo.status": "failed" } }
      );
    } catch (e) {
      // ignore
    }
  }

  res.json({ received: true });
};
