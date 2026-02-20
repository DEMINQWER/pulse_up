"use client"

import { useState } from "react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

export default function ClientLayout({ children }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Navbar onMenuClick={() => setOpen(true)} />

      <div className="app-layout">

        <Sidebar open={open} onClose={() => setOpen(false)} />

        <main className="main">
          {children}
        </main>

      </div>
    </>
  )
}