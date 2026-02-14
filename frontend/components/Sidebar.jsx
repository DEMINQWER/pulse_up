"use client";

import { useRouter } from "next/navigation";

export default function Sidebar({ open, setOpen }) {
  const router = useRouter();

  const navigate = (path) => {
    router.push(path);
    setOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${open ? "active" : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <div className={`sidebar ${open ? "active" : ""}`}>
        <button onClick={() => navigate("/")}>
          📰 Лента
        </button>

        <button onClick={() => navigate("/chats")}>
          💬 Чаты
        </button>

        <button onClick={() => navigate("/profile")}>
          👤 Профиль
        </button>

        <button onClick={() => navigate("/settings")}>
          ⚙ Настройки
        </button>

        <button onClick={() => router.push("/friends")}>
  👥 Друзья
</button>
      </div>
    </>
  );
}