import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoginPage, SignupPage, HomePage, ActivationPage, ProductsPage, BestSellingPage, EventsPage, FAQPage, ProductDetailsPage, ProfilePage, ShopCreatePage, SellerActivationPage, ShopLoginPage } from './Routes.js'
import { ShopHomePage } from './ShopRoutes.js'
import './App.css';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { loadUser, loadSeller } from './redux/actions/user.js';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoutes from "./ProtectedRoutes.js"
import SellerProtectedRoutes from './ShopProtectedRoutes.js';

function App() {
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const { isSeller, isLoading } = useSelector((state) => state.seller);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(loadUser());
    dispatch(loadSeller());
  }, [dispatch]);

  return (
    <>
      {
        loading || isLoading ? (
          <div
            style={{
              width: "100%",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p> Loading...</p >
          </div>

        ) : (
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/products' element={<ProductsPage />} />
              <Route path='/product/:name' element={<ProductDetailsPage />} />
              <Route path='/profile' element={
                <ProtectedRoutes isAuthenticated={isAuthenticated}>
                  <ProfilePage />
                </ProtectedRoutes>
              } />
              <Route path='/best-selling' element={<BestSellingPage />} />
              <Route path='/events' element={<EventsPage />} />
              <Route path='/faq' element={<FAQPage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/sign-up' element={<SignupPage />} />
              <Route path='/activation/:activation_token' element={<ActivationPage />} />
              <Route path='/seller/activation/:activation_token' element={<SellerActivationPage />} />
              {/* shop Router */}
              <Route path='/shop-create' element={<ShopCreatePage />} />
              <Route path='/shop-login' element={<ShopLoginPage />} />
              <Route path='/shop/:id' element={
                <SellerProtectedRoutes isSeller={isSeller}>
                  <ShopHomePage />
                </SellerProtectedRoutes>
              } />

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
        )
      }
    </>
  );
}

export default App;
