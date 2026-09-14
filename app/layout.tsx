import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: "Wish Fried Chicken | Menü",
  description: "Wish Fried Chicken güncel menüsü, burgerlar, wings, tenders, Wish Specials, soslar ve içecekler.",
  openGraph: {
    title: "Wish Fried Chicken | Menü",
    description: "Wish Fried Chicken güncel menüsü, burgerlar, wings, tenders, Wish Specials, soslar ve içecekler.",
    type: "website",
    images: [{ url: "/wish-logo.png", width: 758, height: 1030, alt: "Wish Fried Chicken" }]
  },
  icons: {
    icon: "/wish-logo.png",
    apple: "/wish-logo.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
