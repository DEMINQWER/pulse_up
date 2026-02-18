"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

export default function ClientLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* TOPBAR */}
      <div className="topbar">
        <button className="burger" onClick={() => setOpen(true)}>
          ☰
        </button>
        <div className="logo">PULSE</div>
      </div>

      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* CONTENT */}
      <div className="main-content">
        {children}
      </div>
    </>
  );
}