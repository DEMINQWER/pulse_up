"use client";

import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import "../styles/globals.css";

export default function RootLayout({ children }) {

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "default";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <html>
      <body>
        <div className="app">
          <Sidebar />
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}