const path = require("path");

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: path.join(__dirname, "config/.env"),
  });
}

const express = require("express");
const helmet = require("helmet");
const pino = require("pino");
const pinoHttp = require("pino-http");
const ErrorHandler = require("./middleware/error");
const stripeWebhook = require("./controllers/stripeWebhook");

const app = express();
app.set("trust proxy", 1);

app.post(
  "/api/v2/payment/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

const compression = require("compression");
app.use(compression());

app.use(helmet());

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  redact: ["req.headers.cookie", "req.headers.authorization"],
});
app.use(
  pinoHttp({
    logger,
    autoLogging: { ignore: (req) => req.url === "/health" },
  })
);

const cookieParser = require("cookie-parser");
const cors = require("cors");

const frontendOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const defaultOrigins = [
  "http://localhost:3000",
  "https://eshopzone.vercel.app",
];
const corsOrigins =
  frontendOrigins.length > 0 ? frontendOrigins : defaultOrigins;

app.use(express.json({ limit: "15mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);
app.use(
  require("body-parser").urlencoded({ extended: true, limit: "2mb" })
);

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const mongoose = require("mongoose");
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true, uptime: process.uptime() });
});

app.get("/ready", async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    return res.status(200).json({ ok: true, db: true });
  }
  res.status(503).json({ ok: false, db: false });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/test", (req, res) => {
  res.send("Hello World!");
});

const user = require("./controllers/user");
const shop = require("./controllers/shop.js");
const product = require("./controllers/product");
const event = require("./controllers/event");
const coupon = require("./controllers/couponCode");
const payment = require("./controllers/payment");
const order = require("./controllers/order");
const conversation = require("./controllers/conversation");
const message = require("./controllers/message");
const withdraw = require("./controllers/withdraw");

app.use("/api/v2/user", user);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/api/v2/order", order);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);
app.use("/api/v2/withdraw", withdraw);

app.use(ErrorHandler);

module.exports = app;
