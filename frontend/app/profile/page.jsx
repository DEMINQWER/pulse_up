"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await apiRequest("/users/me", "GET", null, token);
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const deleteAccount = async () => {
    const token = localStorage.getItem("token");
    if (!confirm("Вы точно хотите удалить аккаунт?")) return;

    await apiRequest("/users/delete", "DELETE", null, token);
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!user) return <div>Загрузка...</div>;

  return (
    <div className="profile-wrapper">
      <div className="profile-card glass">

        <h2>👤 Профиль</h2>

        <div className="profile-field glass">
          <span>@{user.username}</span>
        </div>

        <div className="profile-field glass">
          <span>{user.email}</span>
        </div>

        {user.role === "admin" && (
          <button onClick={() => router.push("/admin")}>
            👑 Админ панель
          </button>
        )}

        {user.role === "moderator" && (
          <button onClick={() => router.push("/moderator")}>
            🛡 Панель модератора
          </button>
        )}

        <button onClick={() => router.push("/profile/edit")}>
          ✏ Редактировать профиль
        </button>

        <button onClick={logout}>
          🚪 Выйти из аккаунта
        </button>

        <button
          onClick={deleteAccount}
          style={{ background: "#ff4d4f", color: "white" }}
        >
          🗑 Удалить аккаунт
        </button>

      </div>
    </div>
  );
}