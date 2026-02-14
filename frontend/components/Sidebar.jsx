"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="sidebar">
      <div className="menu">
        <Link className={pathname === "/" ? "active" : ""} href="/">
          Лента
        </Link>

        <Link className={pathname.startsWith("/chats") ? "active" : ""} href="/chats">
          Чаты
        </Link>

        <Link className={pathname.startsWith("/friends") ? "active" : ""} href="/friends">
          Друзья
        </Link>

        <Link className={pathname.startsWith("/profile") ? "active" : ""} href="/profile">
          Профиль
        </Link>
      </div>

      <div className="settings">
        <Link className={pathname.startsWith("/settings") ? "active" : ""} href="/settings">
          Настройки
        </Link>
      </div>
    </div>
  );
}