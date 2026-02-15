"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await apiRequest("/users/me", "GET", null, token);
      setUser(data);
      setForm(data);
    } catch {
      alert("Ошибка загрузки профиля");
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
    } catch {
      alert("Ошибка сохранения профиля");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (loading)
    return <div className="center">Загрузка...</div>;

  return (
    <div className="profile-wrapper">
      <div className="profile-card">

        {/* ===== АВАТАР ===== */}
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
        </div>

        {/* ===== ИНФОРМАЦИЯ ===== */}

        {!editMode ? (
          <>
            <InfoBlock title="Имя пользователя" value={`@${user.username}`} />
            <InfoBlock title="Email" value={user.email} />
            <InfoBlock title="Никнейм" value={user.nickname || "—"} />
            <InfoBlock title="Дата рождения" value={user.birthdate || "—"} />
            <InfoBlock title="Телефон" value={user.phone || "—"} />
            <InfoBlock title="Роль" value={user.role} />

            <button onClick={() => setEditMode(true)}>
              Редактировать профиль
            </button>
          </>
        ) : (
          <div className="edit-panel">
            <h3>Редактирование профиля</h3>

            <input
              placeholder="Имя пользователя"
              value={form.username || ""}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />
            <input
              placeholder="Email"
              value={form.email || ""}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
            <input
              placeholder="Никнейм"
              value={form.nickname || ""}
              onChange={(e) =>
                setForm({ ...form, nickname: e.target.value })
              }
            />
            <input
              placeholder="Дата рождения"
              value={form.birthdate || ""}
              onChange={(e) =>
                setForm({ ...form, birthdate: e.target.value })
              }
            />
            <input
              placeholder="Телефон"
              value={form.phone || ""}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <button onClick={saveProfile}>
              Сохранить изменения
            </button>

            <button
              className="cancel-btn"
              onClick={() => setEditMode(false)}
            >
              Отмена
            </button>
          </div>
        )}

        <button className="logout-btn" onClick={logout}>
          Выйти
        </button>

      </div>
    </div>
  );
}

/* ===== КОМПОНЕНТ ПЛАШКИ ===== */

function InfoBlock({ title, value }) {
  return (
    <div className="info-block">
      <span className="info-title">{title}</span>
      <span className="info-value">{value}</span>
    </div>
  );
}