import "./globals.css";
import React from "react";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Mi App de Cromos",
  description: "Abrir sobres y coleccionar cromos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ minHeight: "100vh", margin: 0 }}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
