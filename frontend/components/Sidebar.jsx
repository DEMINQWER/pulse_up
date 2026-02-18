"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ open, setOpen }) {
  const pathname = usePathname();

  return (
    <aside
      className="sidebar"
      style={{
        transform: open ? "translateX(0)" : "translateX(-100%)",
      }}
    >
      <div className="sidebar-header">
        <span className="sidebar-logo">PULSE</span>
        <button
          className="close-btn"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>
      </div>

      <nav className="menu">
        <Link
          href="/chats"
          className={pathname.startsWith("/chats") ? "active" : ""}
          onClick={() => setOpen(false)}
        >
          💬 Чаты
        </Link>

        <Link
          href="/friends"
          className={pathname.startsWith("/friends") ? "active" : ""}
          onClick={() => setOpen(false)}
        >
          👥 Друзья
        </Link>

        <Link
          href="/profile"
          className={pathname.startsWith("/profile") ? "active" : ""}
          onClick={() => setOpen(false)}
        >
          👤 Профиль
        </Link>
      </nav>

      <div className="settings">
        <Link
          href="/settings"
          className={pathname.startsWith("/settings") ? "active" : ""}
          onClick={() => setOpen(false)}
        >
          ⚙️ Настройки
        </Link>
      </div>
    </aside>
  );
}