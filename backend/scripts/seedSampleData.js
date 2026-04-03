const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config({
  path: path.resolve(__dirname, "../config/.env"),
});

const Shop = require("../model/shop");
const Product = require("../model/product");
const Event = require("../model/event");
const CouponCode = require("../model/couponCode");

function buildDbUrl(rawUrl) {
  if (!rawUrl) {
    throw new Error("DB_URL is not set");
  }

  let url = rawUrl.trim();

  // Ensure a database name exists for Atlas SRV URLs.
  if (url.startsWith("mongodb+srv://") && !/\.mongodb\.net\/[^?]+/.test(url)) {
    url = url.replace(/\.mongodb\.net\/?/, ".mongodb.net/eshop");
  }

  // If query string is missing, add sane defaults.
  if (!url.includes("?")) {
    url += "?retryWrites=true&w=majority&appName=Cluster0";
    return url;
  }

  // If query exists, only append appName when missing.
  if (!url.includes("appName=")) {
    url += "&appName=Cluster0";
  }

  return url;
}

function productDoc(shop, item, index) {
  return {
    name: item.name,
    description: item.description,
    category: item.category,
    tags: item.tags,
    originalPrice: item.originalPrice,
    discountPrice: item.discountPrice,
    stock: item.stock,
    images: [
      {
        public_id: `seed/products/${index + 1}`,
        url: `https://picsum.photos/seed/eshop-product-${index + 1}/800/800`,
      },
    ],
    shopId: String(shop._id),
    shop: {
      _id: shop._id,
      name: shop.name,
      email: shop.email,
      avatar: shop.avatar,
      address: shop.address,
      phoneNumber: shop.phoneNumber,
      zipCode: shop.zipCode,
      role: shop.role,
    },
  };
}

function eventDoc(shop, item, index) {
  const now = Date.now();
  return {
    name: item.name,
    description: item.description,
    category: item.category,
    tags: item.tags,
    originalPrice: item.originalPrice,
    discountPrice: item.discountPrice,
    stock: item.stock,
    start_date: new Date(now - 24 * 60 * 60 * 1000),
    finish_date: new Date(now + (index + 5) * 24 * 60 * 60 * 1000),
    status: "Running",
    images: [
      {
        public_id: `seed/events/${index + 1}`,
        url: `https://picsum.photos/seed/eshop-event-${index + 1}/900/900`,
      },
    ],
    shopId: String(shop._id),
    shop: {
      _id: shop._id,
      name: shop.name,
      email: shop.email,
      avatar: shop.avatar,
      address: shop.address,
      phoneNumber: shop.phoneNumber,
      zipCode: shop.zipCode,
      role: shop.role,
    },
  };
}

async function upsertByName(Model, docs, shopId) {
  const ops = docs.map((doc) => ({
    updateOne: {
      filter: { name: doc.name, shopId: String(shopId) },
      update: { $set: doc },
      upsert: true,
    },
  }));

  const result = await Model.bulkWrite(ops, { ordered: false });
  return {
    inserted: result.upsertedCount || 0,
    updated: result.modifiedCount || 0,
  };
}

async function run() {
  const dbUrl = buildDbUrl(process.env.DB_URL);
  await mongoose.connect(dbUrl, {
    serverSelectionTimeoutMS: 20000,
    connectTimeoutMS: 20000,
  });

  let shop = await Shop.findOne({}).sort({ createdAt: -1 });
  if (!shop) {
    shop = await Shop.create({
      name: "Demo Store",
      email: "demo-seller@eshop.local",
      password: "demo12345",
      address: "Demo Street 1",
      phoneNumber: 1234567890,
      zipCode: 10001,
      avatar: {
        public_id: "seed/demo-shop-avatar",
        url: "https://picsum.photos/seed/eshop-shop/400/400",
      },
      description: "Auto-created demo seller for sample catalog seeding.",
    });
  }

  const products = [
    { name: "Demo Running Shoes", description: "Lightweight shoes for daily runs.", category: "Shoes", tags: "sport,running", originalPrice: 120, discountPrice: 89, stock: 40 },
    { name: "Demo Leather Boots", description: "Durable leather boots for all seasons.", category: "Shoes", tags: "boots,men", originalPrice: 180, discountPrice: 139, stock: 25 },
    { name: "Demo Cotton T-Shirt", description: "Soft breathable cotton tee.", category: "Clothes", tags: "tshirt,casual", originalPrice: 35, discountPrice: 22, stock: 120 },
    { name: "Demo Denim Jacket", description: "Classic fit denim jacket.", category: "Clothes", tags: "jacket,denim", originalPrice: 95, discountPrice: 69, stock: 45 },
    { name: "Demo Wireless Earbuds", description: "Compact earbuds with rich sound.", category: "Electronics", tags: "audio,bluetooth", originalPrice: 99, discountPrice: 74, stock: 80 },
    { name: "Demo Bluetooth Speaker", description: "Portable speaker with deep bass.", category: "Electronics", tags: "speaker,music", originalPrice: 85, discountPrice: 59, stock: 60 },
    { name: "Demo Smart Watch", description: "Health and fitness smart tracker.", category: "Electronics", tags: "watch,fitness", originalPrice: 199, discountPrice: 149, stock: 35 },
    { name: "Demo 4K Smart TV", description: "43 inch UHD smart television.", category: "Electronics", tags: "tv,home", originalPrice: 499, discountPrice: 429, stock: 18 },
    { name: "Demo Gaming Mouse", description: "High precision RGB gaming mouse.", category: "Computers and Laptops", tags: "gaming,pc", originalPrice: 55, discountPrice: 39, stock: 90 },
    { name: "Demo Mechanical Keyboard", description: "Tactile keyboard for gaming and typing.", category: "Computers and Laptops", tags: "keyboard,pc", originalPrice: 120, discountPrice: 89, stock: 50 },
    { name: "Demo Laptop Backpack", description: "Water-resistant backpack with laptop sleeve.", category: "Accessories", tags: "bag,travel", originalPrice: 65, discountPrice: 45, stock: 75 },
    { name: "Demo Cookware Set", description: "Stainless steel 10-piece cookware set.", category: "Home & Kitchen", tags: "kitchen,cook", originalPrice: 210, discountPrice: 169, stock: 20 },
    { name: "Demo Air Fryer 5L", description: "Low-oil cooking air fryer.", category: "Home & Kitchen", tags: "appliance,kitchen", originalPrice: 160, discountPrice: 129, stock: 32 },
    { name: "Demo Vacuum Cleaner", description: "Powerful vacuum cleaner for home.", category: "Home & Kitchen", tags: "home,cleaning", originalPrice: 240, discountPrice: 199, stock: 15 },
    { name: "Demo Face Serum", description: "Vitamin C brightening face serum.", category: "Beauty & Health", tags: "beauty,skincare", originalPrice: 45, discountPrice: 32, stock: 85 },
    { name: "Demo Hair Dryer", description: "Salon-grade hair dryer.", category: "Beauty & Health", tags: "beauty,hair", originalPrice: 75, discountPrice: 54, stock: 40 },
    { name: "Demo Yoga Mat", description: "Non-slip yoga and workout mat.", category: "Sports", tags: "yoga,fitness", originalPrice: 40, discountPrice: 27, stock: 110 },
    { name: "Demo Dumbbell Set", description: "Adjustable dumbbell set for strength training.", category: "Sports", tags: "gym,weights", originalPrice: 130, discountPrice: 99, stock: 28 },
    { name: "Demo Organic Honey", description: "Raw organic honey 500g.", category: "Groceries", tags: "food,organic", originalPrice: 18, discountPrice: 12, stock: 130 },
    { name: "Demo Basmati Rice 5kg", description: "Premium long grain basmati rice.", category: "Groceries", tags: "rice,food", originalPrice: 28, discountPrice: 21, stock: 90 },
    { name: "Demo Story Book Set", description: "Colorful story books for children.", category: "Books", tags: "kids,reading", originalPrice: 42, discountPrice: 29, stock: 65 },
    { name: "Demo STEM Building Blocks", description: "Educational building blocks for kids.", category: "Toys", tags: "kids,learning", originalPrice: 58, discountPrice: 41, stock: 55 },
  ];

  const events = [
    { name: "Demo Flash Deal Sneakers", description: "Limited-time sneakers event.", category: "Shoes", tags: "flash,deal", originalPrice: 130, discountPrice: 79, stock: 30 },
    { name: "Demo Winter Hoodie Event", description: "Seasonal hoodie discounts.", category: "Clothes", tags: "winter,sale", originalPrice: 90, discountPrice: 49, stock: 45 },
    { name: "Demo Gadget Bonanza", description: "Discount event on selected gadgets.", category: "Electronics", tags: "gadget,offer", originalPrice: 220, discountPrice: 159, stock: 25 },
    { name: "Demo Kitchen Essentials Event", description: "Home and kitchen promotion.", category: "Home & Kitchen", tags: "kitchen,event", originalPrice: 180, discountPrice: 129, stock: 20 },
    { name: "Demo Fitness Week", description: "Sports and fitness event pricing.", category: "Sports", tags: "fitness,week", originalPrice: 99, discountPrice: 69, stock: 35 },
    { name: "Demo Beauty Picks Event", description: "Top beauty products special prices.", category: "Beauty & Health", tags: "beauty,event", originalPrice: 70, discountPrice: 45, stock: 50 },
  ];

  const coupons = [
    { name: "WELCOME10", value: 10, minAmount: 30, maxAmount: 100, selectedProduct: "" },
    { name: "SAVE20", value: 20, minAmount: 100, maxAmount: 300, selectedProduct: "" },
    { name: "FREESHIP", value: 5, minAmount: 20, maxAmount: 60, selectedProduct: "" },
    { name: "MEGA30", value: 30, minAmount: 200, maxAmount: 500, selectedProduct: "" },
  ].map((c) => ({ ...c, shopId: String(shop._id) }));

  const productDocs = products.map((p, i) => productDoc(shop, p, i));
  const eventDocs = events.map((e, i) => eventDoc(shop, e, i));

  const productStats = await upsertByName(Product, productDocs, shop._id);
  const eventStats = await upsertByName(Event, eventDocs, shop._id);
  const couponStats = await upsertByName(CouponCode, coupons, shop._id);

  const totalProducts = await Product.countDocuments({ shopId: String(shop._id) });
  const totalEvents = await Event.countDocuments({ shopId: String(shop._id) });
  const totalCoupons = await CouponCode.countDocuments({ shopId: String(shop._id) });

  console.log("Seed complete for shop:", shop.name, String(shop._id));
  console.log("Products:", productStats, "Total:", totalProducts);
  console.log("Events:", eventStats, "Total:", totalEvents);
  console.log("Coupons:", couponStats, "Total:", totalCoupons);

  await mongoose.disconnect();
}

run()
  .then(() => process.exit(0))
  .catch(async (error) => {
    console.error("Seed failed:", error.message);
    try {
      await mongoose.disconnect();
    } catch (e) {
      // ignore
    }
    process.exit(1);
  });
