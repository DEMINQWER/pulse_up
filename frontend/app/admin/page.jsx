"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const [usersData, statsData] = await Promise.all([
        apiRequest("/admin/users", "GET", null, token),
        apiRequest("/admin/stats", "GET", null, token),
      ]);

      setUsers(usersData);
      setStats(statsData);
    } catch (err) {
      console.error(err);
      alert("Ошибка загрузки админ панели");
    } finally {
      setLoading(false);
    }
  };

  const banUser = async (id) => {
    const token = localStorage.getItem("token");
    await apiRequest(`/admin/ban/${id}`, "PUT", null, token);
    loadAll();
  };

  const unbanUser = async (id) => {
    const token = localStorage.getItem("token");
    await apiRequest(`/admin/unban/${id}`, "PUT", null, token);
    loadAll();
  };

  const makeAdmin = async (id) => {
    const token = localStorage.getItem("token");
    await apiRequest(`/admin/make-admin/${id}`, "PUT", null, token);
    loadAll();
  };

  if (loading) {
    return <div className="center">Загрузка админ панели...</div>;
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-card glass">

        <h2 style={{ marginBottom: "25px" }}>
          👑 Панель администратора
        </h2>

        {/* ===== СТАТИСТИКА ===== */}
        {stats && (
          <div
            className="glass"
            style={{
              padding: "20px",
              marginBottom: "30px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "15px",
              textAlign: "center",
            }}
          >
            <div>
              <h3>{stats.total}</h3>
              <div style={{ fontSize: "13px", opacity: 0.7 }}>
                Всего пользователей
              </div>
            </div>

            <div>
              <h3>{stats.admins}</h3>
              <div style={{ fontSize: "13px", opacity: 0.7 }}>
                Администраторы
              </div>
            </div>

            <div>
              <h3>{stats.moderators}</h3>
              <div style={{ fontSize: "13px", opacity: 0.7 }}>
                Модераторы
              </div>
            </div>

            <div>
              <h3>{stats.banned}</h3>
              <div style={{ fontSize: "13px", opacity: 0.7 }}>
                Заблокированные
              </div>
            </div>
          </div>
        )}

        {/* ===== СПИСОК ПОЛЬЗОВАТЕЛЕЙ ===== */}
        {users.length === 0 && (
          <div style={{ opacity: 0.6 }}>
            Пользователей пока нет
          </div>
        )}

        {users.map((user) => (
          <div key={user.id} className="admin-user glass">
            <div>
              <b>@{user.username}</b>

              <div style={{ fontSize: "12px", opacity: 0.6 }}>
                {user.email}
              </div>

              <div style={{ fontSize: "12px" }}>
                Роль: {user.role}
              </div>

              <div style={{ fontSize: "12px" }}>
                Статус: {user.is_banned ? "Заблокирован" : "Активен"}
              </div>
            </div>

            <div className="admin-actions">
              {!user.is_banned ? (
                <button onClick={() => banUser(user.id)}>
                  Забанить
                </button>
              ) : (
                <button onClick={() => unbanUser(user.id)}>
                  Разбанить
                </button>
              )}

              {user.role !== "admin" && (
                <button onClick={() => makeAdmin(user.id)}>
                  Сделать админом
                </button>
              )}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}