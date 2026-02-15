"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await apiRequest("/admin/users", "GET", null, token);
      setUsers(data);
    } catch {
      alert("Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  const banUser = async (id) => {
    const token = localStorage.getItem("token");
    await apiRequest(`/admin/ban/${id}`, "PUT", null, token);
    loadUsers();
  };

  const unbanUser = async (id) => {
    const token = localStorage.getItem("token");
    await apiRequest(`/admin/unban/${id}`, "PUT", null, token);
    loadUsers();
  };

  const makeAdmin = async (id) => {
    const token = localStorage.getItem("token");
    await apiRequest(`/admin/make-admin/${id}`, "PUT", null, token);
    loadUsers();
  };

  if (loading)
    return <div className="center">Загрузка админ панели...</div>;

  return (
    <div className="profile-wrapper">
      <div className="profile-card glass">

        <h2 style={{ marginBottom: "20px" }}>
          👑 Панель администратора
        </h2>

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
                Статус: {user.banned ? "Заблокирован" : "Активен"}
              </div>
            </div>

            <div className="admin-actions">
              {!user.banned ? (
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