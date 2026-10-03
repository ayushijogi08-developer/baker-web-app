import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { Menu } from "./pages/Menu";
import { ProductDetail } from "./pages/ProductDetail";
import { TrackOrder } from "./pages/TrackOrder";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";

import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminProducts } from "./pages/admin/AdminProducts";
import { AdminOrders } from "./pages/admin/AdminOrders";
import { AdminSettings } from "./pages/admin/AdminSettings";

// Global Scroll Restoration Component - Resets scroll to top except when restoring menu position
const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    // Skip reset to top if navigating back to menu with saved scroll state
    if (
      (pathname === "/menu" || pathname === "/") &&
      (sessionStorage.getItem("thb_menu_scroll_y") || sessionStorage.getItem("thb_last_product_id"))
    ) {
      return;
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior
    });
  }, [pathname, search]);

  return null;
};

// Protected Admin Route Guard
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-xs text-[var(--text-muted)]">Verifying session...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

export function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/menu" element={<Layout><Menu /></Layout>} />
              <Route path="/product/:slug" element={<Layout><ProductDetail /></Layout>} />
              <Route path="/track-order" element={<Layout><TrackOrder /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedAdminRoute>
                    <AdminProducts />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedAdminRoute>
                    <AdminOrders />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedAdminRoute>
                    <AdminSettings />
                  </ProtectedAdminRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
