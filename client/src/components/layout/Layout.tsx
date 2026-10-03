import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingWhatsApp } from "../ui/FloatingWhatsApp";
import { CartDrawer } from "../cart/CartDrawer";
import { CheckoutModal } from "../cart/CheckoutModal";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <CartDrawer />
      <CheckoutModal />
    </div>
  );
};
