"use client"

import { useEffect } from "react"

export default function SettingsPage() {

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    if (saved) {
      document.body.setAttribute("data-theme", saved)
    }
  }, [])

  const changeTheme = (theme) => {
    if (theme === "default") {
      document.body.removeAttribute("data-theme")
      localStorage.removeItem("theme")
    } else {
      document.body.setAttribute("data-theme", theme)
      localStorage.setItem("theme", theme)
    }
  }

  return (
    <div className="container">
      <h1 className="title">Настройки</h1>

      <div className="settings-list">

        <div className="settings-item">
          <div className="settings-title">Безопасность</div>
          <div className="settings-sub">
            Смена пароля и защита аккаунта
          </div>
        </div>

        <div className="settings-item">
          <div className="settings-title">Конфиденциальность</div>
          <div className="settings-sub">
            Кто может писать вам сообщения
          </div>
        </div>

        <div className="settings-item">
          <div className="settings-title">Push-уведомления</div>
          <div className="settings-sub">
            Управление уведомлениями
          </div>
        </div>

        <div className="settings-item">
          <div className="settings-title">Тема приложения</div>

          <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
            <button className="primary-btn" onClick={() => changeTheme("default")}>
              Default
            </button>

            <button className="primary-btn" onClick={() => changeTheme("ocean")}>
              Ocean
            </button>

            <button className="primary-btn" onClick={() => changeTheme("sunset")}>
              Sunset
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}