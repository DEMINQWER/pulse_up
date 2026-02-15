"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  const loadUsers = async () => {
    const token = localStorage.getItem("token");
    const data = await apiRequest("/admin/users", "GET", null, token);
    setUsers(data);
  };

  const loadStats = async () => {
    const token = localStorage.getItem("token");
    const data = await apiRequest("/admin/stats", "GET", null, token);
    setStats(data);
  };

  const banUser = async (id) => {
    const token = localStorage.getItem("token");
    await apiRequest(`/admin/ban/${id}`, "PUT", null, token);
    loadUsers();
    loadStats();
  };

  const unbanUser = async (id) => {
    const token = localStorage.getItem("token");
    await apiRequest(`/admin/unban/${id}`, "PUT", null, token);
    loadUsers();
    loadStats();
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-card glass">

        <h2>👑 Админ панель</h2>

        {stats && (
          <div className="admin-stats glass">
            <div>Всего: {stats.total}</div>
            <div>Забанены: {stats.banned}</div>
            <div>Админы: {stats.admins}</div>
            <div>Модераторы: {stats.moderators}</div>
          </div>
        )}

        {users.map((user) => (
          <div key={user.id} className="admin-user glass">
            <div>
              <b>
                @{user.username}
                {user.role === "admin" && " 👑"}
              </b>
              <div style={{ fontSize: 12 }}>
                {user.email}
              </div>
              <div style={{ fontSize: 12 }}>
                Роль: {user.role}
              </div>
              <div style={{ fontSize: 12 }}>
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
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}