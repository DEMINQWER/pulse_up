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

      {open && (
        <div
          className="overlay"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ВАЖНО — класс main-content, а не page-content */}
      <div className="main-content">
        {children}
      </div>
    </>
  );
}