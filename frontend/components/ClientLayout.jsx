"use client"

import { useState, useEffect } from "react"
import Navbar from "./Navbar"

export default function ClientLayout({ children }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    if (saved) {
      document.documentElement.setAttribute("data-theme", saved)
    }
  }, [])

  return (
    <>
      <Navbar open={open} setOpen={setOpen} />

      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      <div className="page-content">
        {children}
      </div>
    </>
  )
}