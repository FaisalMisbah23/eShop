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

function imageUrlFromQuery(query, size = "800x800") {
  if (!query) {
    return `https://picsum.photos/seed/eshop-fallback/${size}`;
  }
  return `https://source.unsplash.com/${size}/?${encodeURIComponent(query)}`;
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
        url: imageUrlFromQuery(item.imageQuery, "800x800"),
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
        url: imageUrlFromQuery(item.imageQuery, "900x900"),
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
    { name: "Nike Air Zoom Pegasus 40", description: "Responsive daily running shoe with breathable mesh upper.", category: "Shoes", tags: "nike,running,men", originalPrice: 140, discountPrice: 119, stock: 36, imageQuery: "nike running shoes product" },
    { name: "Timberland Premium 6-Inch Boots", description: "Waterproof leather boots built for all-weather use.", category: "Shoes", tags: "timberland,boots,leather", originalPrice: 220, discountPrice: 189, stock: 22, imageQuery: "leather boots product photo" },
    { name: "Levi's 501 Original Fit Jeans", description: "Classic straight-fit denim with timeless style.", category: "Clothes", tags: "levis,jeans,denim", originalPrice: 79, discountPrice: 59, stock: 70, imageQuery: "blue denim jeans product" },
    { name: "Uniqlo Supima Cotton Crew Neck Tee", description: "Soft premium cotton t-shirt for everyday wear.", category: "Clothes", tags: "uniqlo,tshirt,casual", originalPrice: 29, discountPrice: 19, stock: 120, imageQuery: "white cotton t shirt product" },
    { name: "Sony WH-1000XM5 Wireless Headphones", description: "Top-tier noise-canceling headphones with clear sound.", category: "Electronics", tags: "sony,headphones,wireless", originalPrice: 399, discountPrice: 329, stock: 24, imageQuery: "wireless headphones product" },
    { name: "JBL Flip 6 Portable Bluetooth Speaker", description: "Compact waterproof speaker with powerful bass.", category: "Electronics", tags: "jbl,speaker,bluetooth", originalPrice: 149, discountPrice: 119, stock: 48, imageQuery: "portable bluetooth speaker product" },
    { name: "Apple Watch SE 2nd Gen", description: "Smart fitness tracking and notifications on your wrist.", category: "Electronics", tags: "apple,smartwatch,fitness", originalPrice: 279, discountPrice: 239, stock: 30, imageQuery: "smart watch product photo" },
    { name: "Samsung 43 Inch Crystal UHD 4K TV", description: "Sharp 4K display with vibrant color and HDR support.", category: "Electronics", tags: "samsung,tv,4k", originalPrice: 549, discountPrice: 469, stock: 16, imageQuery: "4k tv product" },
    { name: "Logitech G502 HERO Gaming Mouse", description: "High-precision gaming mouse with customizable weights.", category: "Computers and Laptops", tags: "logitech,mouse,gaming", originalPrice: 79, discountPrice: 59, stock: 84, imageQuery: "gaming mouse product" },
    { name: "Keychron K2 Mechanical Keyboard", description: "Compact wireless mechanical keyboard with tactile switches.", category: "Computers and Laptops", tags: "keychron,keyboard,mechanical", originalPrice: 109, discountPrice: 89, stock: 52, imageQuery: "mechanical keyboard product" },
    { name: "Samsonite GuardIT 2.0 Laptop Backpack", description: "Durable travel backpack with padded laptop compartment.", category: "Accessories", tags: "samsonite,backpack,laptop", originalPrice: 89, discountPrice: 69, stock: 60, imageQuery: "laptop backpack product" },
    { name: "T-fal Stainless Steel Cookware Set 10-Piece", description: "Versatile cookware set suitable for daily cooking.", category: "Home & Kitchen", tags: "cookware,kitchen,stainless", originalPrice: 229, discountPrice: 179, stock: 20, imageQuery: "stainless cookware set product" },
    { name: "Philips Essential Airfryer XL", description: "Healthy frying with rapid air technology.", category: "Home & Kitchen", tags: "philips,airfryer,kitchen", originalPrice: 189, discountPrice: 149, stock: 34, imageQuery: "air fryer product" },
    { name: "Dyson V8 Cordless Vacuum Cleaner", description: "Powerful cordless vacuum for deep home cleaning.", category: "Home & Kitchen", tags: "dyson,vacuum,home", originalPrice: 449, discountPrice: 379, stock: 14, imageQuery: "cordless vacuum cleaner product" },
    { name: "The Ordinary Vitamin C Suspension 23%", description: "Brightening skincare treatment for uneven tone.", category: "Beauty & Health", tags: "skincare,vitamin c,serum", originalPrice: 24, discountPrice: 18, stock: 90, imageQuery: "vitamin c serum product" },
    { name: "Remington Proluxe Hair Dryer", description: "Fast-dry hair dryer with ionic conditioning.", category: "Beauty & Health", tags: "hair dryer,beauty,remington", originalPrice: 89, discountPrice: 64, stock: 42, imageQuery: "hair dryer product" },
    { name: "Liforme Yoga Mat", description: "Premium non-slip yoga mat for studio and home workouts.", category: "Sports", tags: "yoga,mat,fitness", originalPrice: 120, discountPrice: 95, stock: 48, imageQuery: "yoga mat product" },
    { name: "Bowflex SelectTech 552 Dumbbells", description: "Adjustable dumbbells for full-body strength training.", category: "Sports", tags: "dumbbell,weights,gym", originalPrice: 399, discountPrice: 329, stock: 20, imageQuery: "adjustable dumbbell set product" },
    { name: "Nature Nate's Organic Raw Honey 16oz", description: "Pure raw honey sourced from trusted beekeepers.", category: "Groceries", tags: "organic,honey,food", originalPrice: 16, discountPrice: 12, stock: 130, imageQuery: "honey jar product" },
    { name: "Daawat Extra Long Basmati Rice 5kg", description: "Aromatic premium basmati rice for everyday meals.", category: "Groceries", tags: "rice,basmati,grocery", originalPrice: 32, discountPrice: 24, stock: 88, imageQuery: "basmati rice bag product" },
    { name: "Usborne First Reading Collection", description: "Illustrated beginner-friendly books for young readers.", category: "Books", tags: "books,kids,reading", originalPrice: 49, discountPrice: 35, stock: 54, imageQuery: "children books set product" },
    { name: "LEGO Classic Creative Bricks Box", description: "Open-ended building set to spark creativity.", category: "Toys", tags: "lego,toys,education", originalPrice: 59, discountPrice: 44, stock: 62, imageQuery: "lego building blocks product" },
  ];

  const events = [
    { name: "Nike Weekend Sprint Sale", description: "Limited-time markdowns on premium running footwear.", category: "Shoes", tags: "flash,shoes,sale", originalPrice: 160, discountPrice: 119, stock: 30, imageQuery: "running shoes sale banner" },
    { name: "Denim & Streetwear Festival", description: "Curated picks on jeans, tees, and jackets.", category: "Clothes", tags: "fashion,streetwear,event", originalPrice: 110, discountPrice: 69, stock: 45, imageQuery: "streetwear clothing collection" },
    { name: "Smart Tech Mega Offer", description: "Top gadgets and accessories at special prices.", category: "Electronics", tags: "electronics,gadget,offer", originalPrice: 299, discountPrice: 219, stock: 28, imageQuery: "electronics gadgets product lineup" },
    { name: "Kitchen Upgrade Week", description: "Home cooking essentials and appliances promotion.", category: "Home & Kitchen", tags: "kitchen,home,week", originalPrice: 220, discountPrice: 159, stock: 24, imageQuery: "kitchen appliances product" },
    { name: "Fitness Essentials Drop", description: "Best-value gym and training essentials this week.", category: "Sports", tags: "fitness,sports,training", originalPrice: 129, discountPrice: 89, stock: 35, imageQuery: "fitness equipment product" },
    { name: "Skincare Glow Event", description: "Popular beauty essentials with limited-time savings.", category: "Beauty & Health", tags: "beauty,skincare,event", originalPrice: 85, discountPrice: 59, stock: 50, imageQuery: "skincare products flatlay" },
  ];

  const coupons = [
    { name: "WELCOME10", value: 10, minAmount: 30, maxAmount: 100, selectedProduct: "" },
    { name: "SAVE20", value: 20, minAmount: 100, maxAmount: 300, selectedProduct: "" },
    { name: "FREESHIP", value: 5, minAmount: 20, maxAmount: 60, selectedProduct: "" },
    { name: "MEGA30", value: 30, minAmount: 200, maxAmount: 500, selectedProduct: "" },
  ].map((c) => ({ ...c, shopId: String(shop._id) }));

  await Product.deleteMany({ shopId: String(shop._id), name: /^Demo\s/ });
  await Event.deleteMany({ shopId: String(shop._id), name: /^Demo\s/ });

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
