"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function SidebarProvider({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Navbar open={open} setOpen={setOpen} />
      <Sidebar open={open} setOpen={setOpen} />

      {/* Overlay */}
      {open && (
        <div
          className="overlay"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="page-content">
        {children}
      </div>
    </>
  );
}