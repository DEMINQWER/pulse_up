"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiRequest } from "@/lib/api"

export default function EditProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    username: "",
    email: "",
    nickname: "",
    birthday: "",
    phone: ""
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      const data = await apiRequest("/users/me", "GET", null, token)

      setForm({
        username: data.username || "",
        email: data.email || "",
        nickname: data.nickname || "",
        birthday: data.birthday || "",
        phone: data.phone || ""
      })

      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      const token = localStorage.getItem("token")

      await apiRequest(
        "/users/update",
        "PUT",
        form,
        token
      )

      router.push("/profile")
    } catch (err) {
      console.error(err)
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="profile-wrapper">
        <div className="profile-card glass">
          Загрузка...
        </div>
      </div>
    )
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-card glass edit-card">

        <h2>✏ Редактирование профиля</h2>

        <div className="edit-group">
          <label>Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        </div>

        <div className="edit-group">
          <label>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="edit-group">
          <label>Nickname</label>
          <input
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
          />
        </div>

        <div className="edit-group">
          <label>Дата рождения</label>
          <input
            type="date"
            name="birthday"
            value={form.birthday}
            onChange={handleChange}
          />
        </div>

        <div className="edit-group">
          <label>Телефон</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div className="edit-actions">
          <button
            className="btn-secondary"
            onClick={() => router.back()}
          >
            Отмена
          </button>

          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>

      </div>
    </div>
  )
}