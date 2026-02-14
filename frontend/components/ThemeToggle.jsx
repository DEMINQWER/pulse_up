"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("default");

  // 🔥 При загрузке страницы применяем сохранённую тему
  useEffect(() => {
    const savedTheme = localStorage.getItem("pulse_theme");

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "default");
    }
  }, []);

  // 🔥 Смена темы
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("pulse_theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <button
        onClick={() => changeTheme("default")}
        className={theme === "default" ? "active-theme" : ""}
      >
        Default
      </button>

      <button
        onClick={() => changeTheme("ocean")}
        className={theme === "ocean" ? "active-theme" : ""}
      >
        Ocean
      </button>

      <button
        onClick={() => changeTheme("dark")}
        className={theme === "dark" ? "active-theme" : ""}
      >
        Dark
      </button>
    </div>
  );
}