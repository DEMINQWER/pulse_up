"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");

  const token =
    typeof window !== "undefined" && localStorage.getItem("token");

  useEffect(() => {
    loadAll();
  }, [page]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [usersData, statsData, logsData] = await Promise.all([
        apiRequest(`/admin/users?page=${page}&limit=10`, "GET", null, token),
        apiRequest("/admin/stats", "GET", null, token),
        apiRequest("/admin/logs", "GET", null, token),
      ]);

      setUsers(usersData.users || usersData);
      setStats(statsData);
      setLogs(logsData);
    } catch (err) {
      alert("Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  const banUser = async (id) => {
    const reason = prompt("Причина бана:");
    if (!reason) return;

    await apiRequest(`/admin/ban/${id}`, "POST", { reason }, token);
    loadAll();
  };

  const unbanUser = async (id) => {
    await apiRequest(`/admin/unban/${id}`, "PUT", null, token);
    loadAll();
  };

  const makeAdmin = async (id) => {
    await apiRequest(`/admin/make-admin/${id}`, "PUT", null, token);
    loadAll();
  };

  if (loading) return <div className="center">Загрузка...</div>;

  const chartData = {
    labels: stats?.registration?.map((r) => r.date) || [],
    datasets: [
      {
        label: "Регистрации",
        data: stats?.registration?.map((r) => r.count) || [],
      },
    ],
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-card glass">

        <h2>👑 PULSE Enterprise Admin</h2>

        <div style={{ display: "flex", gap: "15px", margin: "20px 0" }}>
          <button onClick={() => setActiveTab("users")}>Пользователи</button>
          <button onClick={() => setActiveTab("logs")}>Логи</button>
        </div>

        {/* ===== USERS ===== */}
        {activeTab === "users" && (
          <>
            {stats && (
              <>
                <div className="glass" style={{ padding: 20, marginBottom: 20 }}>
                  <div>Всего: {stats.total}</div>
                  <div>Админы: {stats.admins}</div>
                  <div>Модераторы: {stats.moderators}</div>
                  <div>Забанены: {stats.banned}</div>
                </div>

                <div className="glass" style={{ padding: 20, marginBottom: 20 }}>
                  <Bar data={chartData} />
                </div>
              </>
            )}

            {users.map((user) => (
              <div key={user.id} className="admin-user glass">
                <div>
                  <b>@{user.username}</b>
                  <div>{user.email}</div>
                  <div>Роль: {user.role}</div>
                  <div>
                    Статус: {user.is_banned ? "🚫 Заблокирован" : "✅ Активен"}
                  </div>
                </div>

                <div>
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

            {/* ===== PAGINATION ===== */}
            <div style={{ marginTop: 20 }}>
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Назад
              </button>
              <span style={{ margin: "0 10px" }}>Страница {page}</span>
              <button onClick={() => setPage(page + 1)}>
                Вперёд
              </button>
            </div>
          </>
        )}

        {/* ===== LOGS ===== */}
        {activeTab === "logs" && (
          <div className="glass" style={{ padding: 20 }}>
            <h3>Логи действий</h3>
            {logs.map((log) => (
              <div key={log.id} style={{ marginBottom: 10 }}>
                <b>{log.admin}</b> → {log.action} → @{log.target}
                <div style={{ fontSize: 12, opacity: 0.6 }}>
                  {log.created_at}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}