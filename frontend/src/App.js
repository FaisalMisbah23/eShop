import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  HomePage,
  ActivationPage,
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
} from "./routes/Routes.js";
import {
  ShopHomePage,
  ShopDashboardPage,
  ShopCreateProduct,
  ShopAllProducts,
  ShopCreateEvents,
  ShopAllEvents,
  ShopAllCoupons,
  ShopPreviewPage,
  ShopAllOrders,
  ShopOrderDetails,
  ShopAllRefunds,
  ShopSettingsPage,
  ShopWithDrawMoneyPage
} from "./routes/ShopRoutes.js";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { loadUser, loadSeller } from "./redux/actions/user";
import { useDispatch } from "react-redux";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import SellerProtectedRoutes from "./routes/ShopProtectedRoutes";
import { getAllProducts } from "./redux/actions/product";
import { getAllEvents } from "./redux/actions/event";
import axios from "axios";
import { server } from "./server.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get(`${server}/payment/stripeapikey`);
    setStripeApiKey(data.stripeApiKey);
  }

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
    dispatch(loadSeller());
    dispatch(getAllProducts());
    dispatch(getAllEvents());
    getStripeApiKey();
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        {stripeApiKey && (
          <Elements stripe={loadStripe(stripeApiKey)}>
            {" "}
            <Routes>
              <Route
                path="/Payment"
                element={
                  <ProtectedRoutes>
                    <PaymentPage />
                  </ProtectedRoutes>
                }
              />
            </Routes>
          </Elements>
        )}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoutes>
                <ProfilePage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/user/order/:id"
            element={
              <ProtectedRoutes>
                <OrderDetailsPage />
              </ProtectedRoutes>
            }
          />{" "}
          <Route
            path="/user/track/order/:id"
            element={
              <ProtectedRoutes>
                <TrackOrderPage />
              </ProtectedRoutes>
            }
          />
          <Route path="/best-selling" element={<BestSellingPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoutes>
                <CheckoutPage />
              </ProtectedRoutes>
            }
          />
          <Route path="/order/success" element={<OrderSuccessPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
          <Route
            path="/activation/:activation_token"
            element={<ActivationPage />}
          />
          <Route
            path="/seller/activation/:activation_token"
            element={<SellerActivationPage />}
          />
          {/* shop Router */}
          <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />
          <Route path="/shop-create" element={<ShopCreatePage />} />
          <Route path="/shop-login" element={<ShopLoginPage />} />
          <Route
            path="/shop/:id"
            element={
              <SellerProtectedRoutes>
                <ShopHomePage />
              </SellerProtectedRoutes>
            }
          />
          <Route
            path="/settings"
            element={
              <SellerProtectedRoutes>
                <ShopSettingsPage />
              </SellerProtectedRoutes>
            }
          />
          <Route
            path="/dashboard"
            element={
              <SellerProtectedRoutes>
                <ShopDashboardPage />
              </SellerProtectedRoutes>
            }
          />
          <Route
            path="/dashboard-orders"
            element={
              <SellerProtectedRoutes>
                <ShopAllOrders />
              </SellerProtectedRoutes>
            }
          />
          <Route
            path="/dashboard-refunds"
            element={
              <SellerProtectedRoutes>
                <ShopAllRefunds />
              </SellerProtectedRoutes>
            }
          />
          <Route
            path="/order/:id"
            element={
              <SellerProtectedRoutes>
                <ShopOrderDetails />
              </SellerProtectedRoutes>
            }
          />
          <Route
            path="/dashboard-create-product"
            element={
              <SellerProtectedRoutes>
                <ShopCreateProduct />
              </SellerProtectedRoutes>
            }
          />
          <Route
            path="/dashboard-products"
            element={
              <SellerProtectedRoutes>
                <ShopAllProducts />
              </SellerProtectedRoutes>
            }
          />
          <Route
            path="/dashboard-create-event"
            element={
              <SellerProtectedRoutes>
                <ShopCreateEvents />
              </SellerProtectedRoutes>
            }
          />
          <Route
            path="/dashboard-events"
            element={
              <SellerProtectedRoutes>
                <ShopAllEvents />
              </SellerProtectedRoutes>
            }
          />
          <Route
            path="/dashboard-coupons"
            element={
              <SellerProtectedRoutes>
                <ShopAllCoupons />
              </SellerProtectedRoutes>
            }
          />
           <Route
          path="/dashboard-withdraw-money"
          element={
            <SellerProtectedRoutes>
              <ShopWithDrawMoneyPage />
            </SellerProtectedRoutes>
          }
        />
        </Routes>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </BrowserRouter>
    </>
  );
}

export default App;
