import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoginPage, SignupPage, HomePage, ActivationPage, ProductsPage, BestSellingPage, EventsPage, FAQPage } from './Routes.js'
import './App.css';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { loadUser } from './redux/actions/user.js';
import { useDispatch, useSelector } from 'react-redux';

function App() {
  const { loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <>
      {
        loading ? (
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
              <Route path='/best-selling' element={<BestSellingPage />} />
              <Route path='/events' element={<EventsPage />} />
              <Route path='/faq' element={<FAQPage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/sign-up' element={<SignupPage />} />
              <Route path='/activation/:activation_token' element={<ActivationPage />} />
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
