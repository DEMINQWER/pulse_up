"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [theme, setTheme] = useState("pulse");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "pulse";
    setTheme(saved);
  }, []);

  const changeTheme = (value) => {
    setTheme(value);
    localStorage.setItem("theme", value);
    document.documentElement.setAttribute("data-theme", value);
  };

  return (
    <div className="page">
      <h2>Настройки</h2>

      <div className="settings-list">

        <div className="settings-item">
          <div className="settings-title">Тема приложения</div>

          <div className="theme-buttons">

            <button
              className={theme === "pulse" ? "active-theme" : ""}
              onClick={() => changeTheme("pulse")}
            >
              Пульс
            </button>

            <button
              className={theme === "ocean" ? "active-theme" : ""}
              onClick={() => changeTheme("ocean")}
            >
              Океан
            </button>

            <button
              className={theme === "sapphire" ? "active-theme" : ""}
              onClick={() => changeTheme("sapphire")}
            >
              Сапфир
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}