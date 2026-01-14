"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-white/20 backdrop-blur-lg shadow-lg border-b border-white/30 text-gray-900">
      <Link href="/" className="text-3xl font-bold italic text-white drop-shadow">
        Dorsya
      </Link>

      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link
              href="/login"
              className="bg-fuchsia-600 text-white px-4 py-2 rounded-full shadow hover:bg-fuchsia-700 transition"
            >
              Giriş Yap
            </Link>
            <Link
              href="/register"
              className="bg-purple-400 text-white px-4 py-2 rounded-full shadow hover:bg-purple-500 transition"
            >
              Kayıt Ol
            </Link>
          </>
        ) : (
          <>
            <span className="text-white font-medium">{user.name}</span>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-full shadow hover:bg-red-700 transition"
            >
              Çıkış Yap
            </button>
          </>
        )}
      </div>
    </header>
  );
}
