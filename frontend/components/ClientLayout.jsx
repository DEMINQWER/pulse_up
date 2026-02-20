"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function ClientLayout({ children }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
  }, [open]);

  return (
    <>
  {open && (
    <div
      className="sidebar-overlay"
      onClick={() => setOpen(false)}
    />
  )}

  <div className="topbar">
    <button className="burger" onClick={() => setOpen(true)}>
      ☰
    </button>
    <div className="logo">PULSE</div>
  </div>

  <Sidebar open={open} setOpen={setOpen} />

  <div className="main-content">
  <div className="page-wrapper">
    {children}
  </div>
</div>
</>
  );
}