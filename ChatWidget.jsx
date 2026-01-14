"use client";

import { useState } from "react";
import Link from "next/link";

const API_URL = "http://localhost:5000/api/ai/chat";

function makeId() {
  return Date.now().toString() + Math.random().toString(36).slice(2);
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: makeId(),
      role: "assistant",
      text: "Merhaba 👋 Ürün arama, fiyat karşılaştırma ve öneri yapabilirim.",
    },
  ]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    // user mesajı
    setMessages((prev) => [...prev, { id: makeId(), role: "user", text }]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      let data;

      try {
        data = await res.json();
      } catch (e) {
        const raw = await res.text();
        data = { reply: `Sunucu JSON dönmedi: ${raw.slice(0, 200)}`, products: [] };
      }

      if (!res.ok) {
        data = data || {};
        data.reply = data.reply || data.message || "Sunucu hatası oluştu.";
        data.products = [];
      }

      // assistant mesajı (TEK KERE)
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          text: data.reply || "Bir yanıt alamadım.",
          products: data.products || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: "assistant", text: "Sunucuya bağlanılamadı." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-24 right-4 z-[9999]">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-fuchsia-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-fuchsia-700 transition"
        >
          💬 Chat
        </button>
      )}

      {open && (
        <div className="w-80 h-[480px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 bg-fuchsia-600 text-white">
            <span className="font-semibold">Dorsy Asistant</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-sm">
            {messages.map((m, i) => (
              <div
                key={m.id || i}
                className={`${m.role === "user" ? "text-right" : "text-left"}`}
              >
                <div
                  className={`inline-block px-3 py-2 rounded-xl max-w-[90%] leading-relaxed ${
                    m.role === "user"
                      ? "bg-fuchsia-100 text-gray-900"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {m.text}
                </div>

                {/* Ürün kartları */}
                {m.products?.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {m.products.map((p) => (
                      <Link
                        key={p.id}
                        href={`/products/${p.id}`}
                        className="block"
                      >
                        <div className="flex gap-2 p-2 border rounded-xl bg-white text-gray-900 cursor-pointer hover:border-fuchsia-600 hover:shadow transition">
                          {p.imageUrl && (
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-12 h-12 object-contain"
                            />
                          )}

                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 break-words">
                              {p.name}
                            </div>

                            <div className="text-fuchsia-600 font-bold">
                              {p.price} ₺
                            </div>

                            {p.rating != null && (
                              <div className="text-xs text-gray-700">
                                ⭐ {p.rating}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Bir şey sor..."
              disabled={loading}
              className="
                flex-1
                px-4 py-3
                text-sm
                rounded-xl
                border
                border-gray-300
                bg-white
                text-gray-900
                placeholder:text-gray-400
                focus:outline-none
                focus:ring-2
                focus:ring-fuchsia-500
              "
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-fuchsia-600 text-white px-3 rounded-xl"
            >
              {loading ? "..." : "➤"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
