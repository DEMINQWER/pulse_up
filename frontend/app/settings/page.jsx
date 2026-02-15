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
      console.error("PROFILE ERROR:", err);
      router.push("/login");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!user) {
    return <div className="center">Загрузка профиля...</div>;
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-card glass">

        <h2 style={{ marginBottom: "20px" }}>
          👤 Профиль
        </h2>

        <div className="profile-field glass">
          <span>Username</span>
          <b>@{user.username}</b>
        </div>

        <div className="profile-field glass">
          <span>Email</span>
          <b>{user.email}</b>
        </div>

        <div className="profile-field glass">
          <span>Никнейм</span>
          <b>{user.nickname || "Не указан"}</b>
        </div>

        <div className="profile-field glass">
          <span>Дата рождения</span>
          <b>{user.birthdate || "Не указана"}</b>
        </div>

        <div className="profile-field glass">
          <span>Телефон</span>
          <b>{user.phone || "Не указан"}</b>
        </div>

        <div className="profile-field glass">
          <span>Роль</span>
          <b>
            {user.role === "admin" && "👑 Администратор"}
            {user.role === "moderator" && "🛡 Модератор"}
            {user.role === "user" && "Пользователь"}
          </b>
        </div>

        {user.role === "admin" && (
          <button
            style={{ marginTop: "15px" }}
            onClick={() => router.push("/admin")}
          >
            👑 Админ панель
          </button>
        )}

        <button
          style={{ marginTop: "10px" }}
          onClick={() => router.push("/settings")}
        >
          ⚙ Настройки
        </button>

        <button
          onClick={logout}
          style={{
            marginTop: "20px",
            padding: "10px 15px",
            background: "#ff4d4f",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          🚪 Выйти из аккаунта
        </button>

      </div>
    </div>
  );
}