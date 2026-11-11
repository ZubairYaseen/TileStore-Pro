import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TileStore Pro | Smart Tile Store & Inventory Management",
  description: "Prototype for a smart tile store and inventory management system.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
