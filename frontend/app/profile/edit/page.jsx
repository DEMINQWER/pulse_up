"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [theme, setTheme] = useState("pulse");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "pulse";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const changeTheme = (value) => {
    setTheme(value);
    localStorage.setItem("theme", value);
    document.documentElement.setAttribute("data-theme", value);
  };

  return (
    <div className="page">
      <h2>Настройки</h2>

      <h3>🎨 Тема</h3>

      <button onClick={() => changeTheme("pulse")}>
        Пульс (по умолчанию)
      </button>

      <button onClick={() => changeTheme("ocean")}>
        Океан
      </button>

      <button onClick={() => changeTheme("sapphire")}>
        Сапфир
      </button>

    </div>
  );
}