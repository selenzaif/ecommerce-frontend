"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    { href: "/", label: "Ana Sayfa", icon: "🏠" },
    { href: "/favorites", label: "Favoriler", icon: "❤️" },
    { href: "/cart", label: "Sepetim", icon: "🛒" },
    { href: "/orders", label: "Siparişlerim", icon: "📦" },
    { href: "/profile", label: "Profilim", icon: "👤" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around py-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center text-xs ${
              pathname === item.href
                ? "text-fuchsia-600 font-semibold"
                : "text-gray-600"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
