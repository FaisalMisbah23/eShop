const isProduction = false;

export const server = isProduction
  ? "https://e-shop-backend-gules.vercel.app/api/v2"
  : "http://eshop-backend-alb-1926786586.eu-north-1.elb.amazonaws.com/api/v2";

export const socketUrl = isProduction
  ? "https://eshop-qc49.onrender.com"
  : "https://eshop-qc49.onrender.com";
