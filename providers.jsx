"use client";

import { AuthProvider } from "@/app/context/AuthContext";          // ✔ DÜZELTİLDİ
import { FavoritesProvider } from "@/app/context/FavoritesContext"; // ✔ DÜZELTİLDİ

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        {children}
      </FavoritesProvider>
    </AuthProvider>
  );
}
