const isProduction = process.env.NODE_ENV === "production";

export const server = isProduction
  ? "/api/v2"
  : "http://localhost:8001/api/v2";

export const socketUrl = isProduction
  ? "https://eshop-qc49.onrender.com"
  : "http://localhost:6001";
