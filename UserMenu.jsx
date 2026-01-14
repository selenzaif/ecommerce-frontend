"use client";

import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { useState } from "react";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      {/* Kullanıcı ismi */}
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-2 bg-white/70 rounded-xl shadow-md hover:bg-white transition"
      >
        {user.name}
      </button>

      {/* Açılır Menü */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white shadow-lg border border-gray-200 z-50">
          <Link
            href="/profile"
            className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
          >
            Profilim
          </Link>

          <Link
            href="/orders"
            className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
          >
            Siparişlerim
          </Link>

          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
          >
            Çıkış Yap
          </button>
        </div>
      )}
    </div>
  );
}
