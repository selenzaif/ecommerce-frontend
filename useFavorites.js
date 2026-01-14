"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "favorites";
const API_URL = "http://localhost:5000/api/favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = async (product) => {
    const userId = localStorage.getItem("userId"); // örnek: token’dan alabilirsin
    const productId = product.id;

    // frontend state güncellemesi
    setFavorites((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [...prev, product];
    });

    // backend'e isteği gönder
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });
    } catch (err) {
      console.error("Favori kaydedilemedi:", err);
    }
  };

  const isFavorite = (id) => favorites.some((p) => p.id === id);

  return { favorites, toggleFavorite, isFavorite };
}
