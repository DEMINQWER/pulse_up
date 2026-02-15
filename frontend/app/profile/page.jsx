"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      const data = await apiRequest("/users/me", "GET", null, token);
      setUser(data);
      setForm(data);
    } catch (err) {
      setError("Ошибка загрузки профиля");
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await apiRequest("/users/update", "PUT", form, token);
      setUser(data);
      setEditMode(false);
    } catch (err) {
      alert("Ошибка сохранения профиля");
    }
  };

  const uploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/avatar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      setUser({
        ...user,
        avatar_url:
          process.env.NEXT_PUBLIC_API_URL + data.avatar_url,
      });
    } catch {
      alert("Ошибка загрузки аватара");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (loading)
    return <div className="center">Загрузка профиля...</div>;

  if (error)
    return <div className="center error">{error}</div>;

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <div className="avatar-box">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="Аватар"
              className="avatar"
            />
          ) : (
            <div className="avatar-placeholder">
              {user.username?.[0]?.toUpperCase()}
            </div>
          )}
          <input type="file" onChange={uploadAvatar} />
        </div>

        {editMode ? (
          <>
            <input
              value={form.username || ""}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              placeholder="Имя пользователя"
            />
            <input
              value={form.email || ""}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="Email"
            />
            <input
              value={form.nickname || ""}
              onChange={(e) =>
                setForm({ ...form, nickname: e.target.value })
              }
              placeholder="Никнейм"
            />
            <input
              value={form.birthdate || ""}
              onChange={(e) =>
                setForm({ ...form, birthdate: e.target.value })
              }
              placeholder="Дата рождения"
            />
            <input
              value={form.phone || ""}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              placeholder="Телефон"
            />

            <button onClick={saveProfile}>
              Сохранить изменения
            </button>
          </>
        ) : (
          <>
            <h2>
              @{user.username}{" "}
              {user.role === "admin" && "👑"}
            </h2>

            <p><b>Email:</b> {user.email || "—"}</p>
            <p><b>Никнейм:</b> {user.nickname || "—"}</p>
            <p><b>Дата рождения:</b> {user.birthdate || "—"}</p>
            <p><b>Телефон:</b> {user.phone || "—"}</p>
            <p><b>Роль:</b> {user.role}</p>

            <button onClick={() => setEditMode(true)}>
              Редактировать профиль
            </button>
          </>
        )}

        {user.role === "admin" && (
          <button
            onClick={() => (window.location.href = "/admin")}
          >
            Панель администратора
          </button>
        )}

        <button className="logout-btn" onClick={logout}>
          Выйти
        </button>
      </div>
    </div>
  );
}