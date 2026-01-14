"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BottomNav from "./components/BottomNav";

const API_URL = "http://localhost:5000/api";

const CATEGORIES = [
  "Tümü",
  "Kadın",
  "Erkek",
  "Teknoloji",
  "Spor",
  "Kozmetik",
  "Moda",
  "Ayakkabı",
  "Çanta",
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Ürünleri getir
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Ürünler alınamadı");
        setProducts(data);
      } catch (err) {
        setError(err.message || "Sunucu hatası");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Favoriler localStorage’dan al
  useEffect(() => {
    const storedFavs = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavs);
  }, []);

  const toggleFavorite = async (productId) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      alert("Lütfen giriş yapın!");
      return;
    }

    let updatedFavorites;

    if (favorites.includes(productId)) {
      await fetch(`${API_URL}/favorites/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      updatedFavorites = favorites.filter((id) => id !== productId);
    } else {
      await fetch(`${API_URL}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, productId }),
      });

      updatedFavorites = [...favorites, productId];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const filteredProducts = products.filter((p) => {
  if (activeCategory === "Tümü") return true;

  const productCat = p.category?.toLowerCase() || "";

  // Akıllı filtreleme
  return productCat.includes(activeCategory.toLowerCase());
});


  return (
    <div
      className="min-h-screen text-gray-900 pb-24 relative z-0"
      style={{
        background:
          "linear-gradient(135deg, #ffe5f1, #e2d7ff, #cfe8ff, #ffe3cc)",
        fontFamily: "'Courier New', monospace",
      }}
    >
      {/* ❌ HEADER TAMAMEN SİLİNDİ — ARTIK LAYOUT KULLANIYOR */}
      {/* <header> ... </header> */}

      {/* Kategoriler */}
      <section className="mt-10">
        <div className="w-full py-4 bg-white/40 backdrop-blur-lg shadow-lg border-b border-white/50 flex justify-center">
          <div className="max-w-6xl w-full flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm border transition shadow-sm ${
                  activeCategory === cat
                    ? "bg-fuchsia-600 text-white border-fuchsia-500 shadow-fuchsia-300/60"
                    : "bg-white/70 text-slate-800 border-white hover:bg-fuchsia-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Ürünler */}
      <main className="w-full max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold italic text-white drop-shadow mb-3">
          {activeCategory === "Tümü"
            ? "Tüm Ürünler"
            : `${activeCategory} Ürünleri`}
        </h2>

        {loading && (
          <p className="text-white/80 text-sm mt-4">Ürünler yükleniyor...</p>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <p className="text-white/90 text-sm mt-4">
            Bu kategoride henüz ürün bulunmuyor.
          </p>
        )}

        {/* Ürün Kartları */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">

          {filteredProducts.map((product) => (
            <div
              key={product.id}
className="relative bg-white/70 border border-white/80 rounded-3xl shadow-xl overflow-hidden hover:-translate-y-1 hover:shadow-fuchsia-300/60 transition transform max-w-sm"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(product.id);
                }}
                className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 text-sm shadow-md hover:scale-110 transition z-50 cursor-pointer"
              >
                {favorites.includes(product.id) ? "❤️" : "🤍"}
              </button>

              <Link href={`/products/${product.id}`} className="block">
                <div className="w-full h-32 bg-white/80 overflow-hidden flex items-center justify-center">

                  {product.imageUrl ? (
                    <img
  src={product.imageUrl}
  className="w-full h-full object-contain max-h-32 transition-transform duration-300 hover:scale-105"
/>

                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      Görsel Yok
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-sm font-semibold text-slate-900 mb-1">
                    {product.name}
                  </p>
                  <span className="text-fuchsia-600 font-bold">
                    {product.price} ₺
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
