import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Role } from "./types";

import { ProductsPage } from "./pages/Products";
import { LoginPage } from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import { ForgotPasswordPage } from "./pages/ForgotPassword";
import { ResetPasswordPage } from "./pages/ResetPassword";
import { CartPage } from "./pages/Cart";
import { OrdersPage } from "./pages/Orders";
import { Admin } from "./pages/Admin";


const NotFoundPage = () => (
  <div className="p-8 text-center text-xl">404 - Sahifa topilmadi</div>
);

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Ochiq routelar */}
              <Route path="/" element={<ProductsPage />} />

              {/* Mehmonlar uchun routelar */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage />}
                />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
              </Route>

              {/* Avtorizatsiyadan o'tgan foydalanuvchilar */}
              <Route element={<ProtectedRoute />}>
                <Route path="/cart" element={<CartPage />} />
                <Route path="/orders" element={<OrdersPage />} />
              </Route>

              {/* Admin routelar */}
              <Route element={<ProtectedRoute allowedRoles={[Role.ADMIN]} />}>
                <Route path="/admin" element={<Admin />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
