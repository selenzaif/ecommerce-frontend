"use client";

import { AuthProvider } from "./context/AuthContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import Navbar from "./components/Navbar.jsx";

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Navbar />
        {children}
      </FavoritesProvider>
    </AuthProvider>
  );
}
