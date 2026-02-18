import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home'; // Will become Shop Home
import Shop from './pages/Shop';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/Layout'; // Existing layout, will be Shop specific
import ParlourLayout from './components/ParlourLayout'; // New
import ParlourHome from './pages/ParlourHome'; // New
import ParlourBooking from './pages/ParlourBooking'; // New

import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import { AppointmentProvider } from './context/AppointmentContext';
import { ServiceProvider } from './context/ServiceContext';
import { OrderProvider } from './context/OrderContext';

// Temporary component for Shop Layout until we rename existing Layout
const ShopLayoutWrapper = () => <Layout />;

function App() {
  useEffect(() => {
    console.info('Firebase env loaded', {
      hasApiKey: Boolean(import.meta.env.VITE_FIREBASE_API_KEY),
      hasAuthDomain: Boolean(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
      hasProjectId: Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID),
      hasStorageBucket: Boolean(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
      hasMessagingSenderId: Boolean(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
      hasAppId: Boolean(import.meta.env.VITE_FIREBASE_APP_ID),
      hasMeasurementId: Boolean(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID)
    });
  }, []);

  return (
    <AuthProvider>
      <ShopProvider>
        <AppointmentProvider>
          <ServiceProvider>
            <OrderProvider>
              <BrowserRouter>
                <Routes>
                  {/* Entry Point */}
                  <Route path="/" element={<Landing />} />

                  {/* Parlour Routes */}
                  <Route path="/parlour" element={<ParlourLayout />}>
                    <Route index element={<ParlourHome />} />
                    <Route path="book" element={<ParlourBooking />} />
                  </Route>

                  {/* Shop Routes */}
                  <Route path="/shop" element={<ShopLayoutWrapper />}>
                    <Route index element={<Shop />} />
                    <Route path="checkout" element={<Checkout />} />
                    {/* Product details etc */}
                  </Route>

                  {/* Shared/Utility Routes - kept flat for now or moved under themes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />

                </Routes>
              </BrowserRouter>
            </OrderProvider>
          </ServiceProvider>
        </AppointmentProvider>
      </ShopProvider>
    </AuthProvider>
  );
}

export default App;
