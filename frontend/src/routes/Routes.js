import { lazy } from "react";

const LoginPage = lazy(() => import("../pages/LoginPage"));
const SignupPage = lazy(() => import("../pages/SignupPage"));
const ActivationPage = lazy(() => import("../pages/ActivationPage"));
const SellerActivationPage = lazy(() => import("../pages/SellerActivationPage"));
const HomePage = lazy(() => import("../pages/HomePage"));
const ProductsPage = lazy(() => import("../pages/ProductsPage"));
const BestSellingPage = lazy(() => import("../pages/BestSellingPage"));
const EventsPage = lazy(() => import("../pages/EventsPage"));
const FAQPage = lazy(() => import("../pages/FAQPage"));
const ProductDetailsPage = lazy(() => import("../pages/ProductDetailsPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const ShopCreatePage = lazy(() => import("../pages/ShopCreatePage"));
const ShopLoginPage = lazy(() => import("../pages/ShopLoginPage"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
const PaymentPage = lazy(() => import("../pages/PaymentPage"));
const OrderSuccessPage = lazy(() => import("../pages/OrderSuccessPage"));
const OrderDetailsPage = lazy(() => import("../pages/OrderDetailsPage"));
const TrackOrderPage = lazy(() => import("../pages/TrackOrderPage"));
const UserInbox = lazy(() => import("../pages/UserInbox.jsx"));
const PrivacyPage = lazy(() => import("../pages/PrivacyPage"));
const TermsPage = lazy(() => import("../pages/TermsPage"));

export {
  LoginPage,
  SignupPage,
  ActivationPage,
  HomePage,
  ProductsPage,
  BestSellingPage,
  EventsPage,
  FAQPage,
  ProductDetailsPage,
  ProfilePage,
  ShopCreatePage,
  SellerActivationPage,
  ShopLoginPage,
  CheckoutPage,
  PaymentPage,
  OrderSuccessPage,
  OrderDetailsPage,
  TrackOrderPage,
  UserInbox,
  PrivacyPage,
  TermsPage,
};
