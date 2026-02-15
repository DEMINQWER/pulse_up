"use client";

import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [onlyBanned, setOnlyBanned] = useState(false);
  const [activeTab, setActiveTab] = useState("users");

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
      alert("Ошибка загрузки админ панели");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users
      .filter((u) =>
        u.username?.toLowerCase().includes(search.toLowerCase())
      )
      .filter((u) =>
        roleFilter === "all" ? true : u.role === roleFilter
      )
      .filter((u) => (onlyBanned ? u.is_banned : true));
  }, [users, search, roleFilter, onlyBanned]);

  const token = typeof window !== "undefined" && localStorage.getItem("token");

  const action = async (url) => {
    await apiRequest(url, "PUT", null, token);
    loadAll();
  };

  if (loading) {
    return <div className="center">Загрузка админ панели...</div>;
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-card glass">

        <h2 style={{ marginBottom: "20px" }}>👑 PULSE Admin</h2>

        {/* ===== ВКЛАДКИ ===== */}
        <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
          <button onClick={() => setActiveTab("users")}>Пользователи</button>
          <button onClick={() => setActiveTab("reports")}>Жалобы</button>
        </div>

        {/* ===== СТАТИСТИКА ===== */}
        {stats && activeTab === "users" && (
          <div
            className="glass"
            style={{
              padding: "20px",
              marginBottom: "25px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "15px",
              textAlign: "center",
            }}
          >
            <div>
              <h3>{stats.total}</h3>
              <small>Всего</small>
            </div>
            <div>
              <h3>{stats.admins}</h3>
              <small>Админы</small>
            </div>
            <div>
              <h3>{stats.moderators}</h3>
              <small>Модераторы</small>
            </div>
            <div>
              <h3>{stats.banned}</h3>
              <small>Забанены</small>
            </div>
          </div>
        )}

        {/* ===== ПОЛЬЗОВАТЕЛИ ===== */}
        {activeTab === "users" && (
          <>
            {/* Поиск и фильтры */}
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input
                placeholder="Поиск по username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Все роли</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="user">User</option>
              </select>

              <label>
                <input
                  type="checkbox"
                  checked={onlyBanned}
                  onChange={() => setOnlyBanned(!onlyBanned)}
                />
                Только забаненные
              </label>
            </div>

            {filteredUsers.map((user) => (
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
                    Статус: {user.is_banned ? "🚫 Заблокирован" : "✅ Активен"}
                  </div>
                </div>

                <div className="admin-actions">
                  {!user.is_banned ? (
                    <button onClick={() => action(`/admin/ban/${user.id}`)}>
                      Забанить
                    </button>
                  ) : (
                    <button onClick={() => action(`/admin/unban/${user.id}`)}>
                      Разбанить
                    </button>
                  )}

                  {user.role !== "admin" && (
                    <button onClick={() => action(`/admin/make-admin/${user.id}`)}>
                      Сделать админом
                    </button>
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        {/* ===== ЖАЛОБЫ (заготовка) ===== */}
        {activeTab === "reports" && (
          <div className="glass" style={{ padding: "20px" }}>
            <h3>Жалобы пользователей</h3>
            <p style={{ opacity: 0.6 }}>
              Здесь будут отображаться жалобы.
              Нужно добавить backend endpoint /admin/reports
            </p>
          </div>
        )}
      </div>
    </div>
  );
}