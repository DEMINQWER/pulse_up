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

      <div
        className="page-content"
        onClick={() => open && setOpen(false)}
      >
        {children}
      </div>
    </>
  );
}