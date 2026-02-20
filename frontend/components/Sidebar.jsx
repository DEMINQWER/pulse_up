"use client"
import Link from "next/link"

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="overlay" onClick={onClose}></div>}

      <div className={`sidebar mobile ${open ? "open" : ""}`}>

        <button onClick={onClose} style={{marginBottom: 20}}>
          ✕
        </button>

        <Link href="/chats" onClick={onClose}>Чаты</Link>
        <Link href="/friends" onClick={onClose}>Друзья</Link>
        <Link href="/profile" onClick={onClose}>Профиль</Link>
        <Link href="/settings" onClick={onClose}>Настройки</Link>

      </div>
    </>
  )
}