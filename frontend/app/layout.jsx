"use client";

import "./globals.css";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

export const metadata = {
  title: "Pulse",
  description: "Messenger App",
};

export default function RootLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <html lang="ru">
      <body>

        {/* TOPBAR */}
        <div className="topbar">
          <button className="burger" onClick={() => setOpen(true)}>
            ☰
          </button>
          <div className="logo">PULSE</div>
        </div>

        {/* SIDEBAR */}
        <Sidebar open={open} setOpen={setOpen} />

        {/* MAIN CONTENT */}
        <div className="main-content">
          {children}
        </div>

      </body>
    </html>
  );
}