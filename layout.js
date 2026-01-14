import "./globals.css";
import Providers from "./providers";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav"; // ✔ EKLENMELİ
import ChatWidget from "./components/ChatWidget";

export const metadata = {
  
  description: "E-Ticaret Sitesi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="relative">
        <Providers>
          <Navbar />

          {children}
          <ChatWidget /> 

          <BottomNav />     {/* ✔ TÜM SAYFALARDA GÖRÜNSÜN */}
        </Providers>
      </body>
    </html>
  );
}
