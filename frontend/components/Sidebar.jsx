"use client"

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="overlay" onClick={onClose}></div>}

      <div className={`sidebar mobile ${open ? "open" : ""}`}>
        <button onClick={onClose} style={{marginBottom: 20}}>
          ✕
        </button>

        <div>Чаты</div>
        <div>Друзья</div>
        <div>Профиль</div>
        <div>Настройки</div>
        <div>Админ</div>
      </div>
    </>
  )
}