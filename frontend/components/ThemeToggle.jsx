"use client"

import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const [theme, setTheme] = useState("pulse")

  useEffect(() => {
    const saved = localStorage.getItem("pulse_theme")
    if (saved) {
      setTheme(saved)
      document.documentElement.setAttribute("data-theme", saved)
    }
  }, [])

  const changeTheme = (t) => {
    setTheme(t)
    localStorage.setItem("pulse_theme", t)
    document.documentElement.setAttribute("data-theme", t)
  }

  return (
    <div style={{ display: "flex", gap: 10 }}>
      <button onClick={() => changeTheme("pulse")}>Pulse</button>
      <button onClick={() => changeTheme("sup")}>Sup</button>
      <button onClick={() => changeTheme("ocean")}>Ocean</button>
    </div>
  )
}