"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function EditProfilePage() {

  const [form, setForm] = useState({
    username: "",
    email: "",
    nickname: "",
    phone: "",
    birthdate: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const data = await apiRequest(
        "/users/me",
        "GET",
        null,
        token
      );

      setForm({
        username: data.username || "",
        email: data.email || "",
        nickname: data.nickname || "",
        phone: data.phone || "",
        birthdate: data.birthdate
          ? data.birthdate.split("T")[0]
          : ""
      });

      setLoading(false);

    } catch (err) {
      console.error("LOAD PROFILE ERROR:", err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");

      const token = localStorage.getItem("token");

      await apiRequest(
        "/users/me",
        "PUT",
        {
          username: form.username,
          nickname: form.nickname,
          phone: form.phone,
          birthdate: form.birthdate || null
        },
        token
      );

      setMessage("Профиль успешно обновлён");
      setSaving(false);

    } catch (err) {
      console.error("UPDATE ERROR:", err);
      setMessage("Ошибка при обновлении");
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="center">Загрузка...</div>;
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-card">

        <h2 style={{ marginBottom: "20px" }}>
          Редактирование профиля
        </h2>

        <div className="edit-panel">

          <label>Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
          />

          <label>Email (изменить нельзя)</label>
          <input
            value={form.email}
            disabled
            style={{ opacity: 0.6 }}
          />

          <label>Никнейм</label>
          <input
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
          />

          <label>Телефон</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <label>Дата рождения</label>
          <input
            type="date"
            name="birthdate"
            value={form.birthdate}
            onChange={handleChange}
          />

          <button onClick={handleSave} disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить изменения"}
          </button>

          {message && (
            <div style={{ marginTop: 10, opacity: 0.8 }}>
              {message}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}