"use client";

import { useEffect, useState } from "react";

const API = "https://pulse-9ui4.onrender.com";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setUser(data);
    setForm(data);
    setLoading(false);
  };

  const updateProfile = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/users/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setUser(data);
    setEdit(false);
  };

  const uploadAvatar = async (e) => {
    const token = localStorage.getItem("token");
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch(`${API}/users/avatar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    setUser({ ...user, avatar_url: API + data.avatar_url });
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (loading) return <div style={center}>Loading...</div>;

  return (
    <div style={wrapper}>
      <div style={card}>
        <div style={avatarBox}>
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="avatar"
              style={avatar}
            />
          ) : (
            <div style={avatarPlaceholder}>
              {user.username?.[0]?.toUpperCase()}
            </div>
          )}
          <input type="file" onChange={uploadAvatar} />
        </div>

        {edit ? (
          <>
            <input
              value={form.username || ""}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />
            <input
              value={form.email || ""}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
            <input
              value={form.nickname || ""}
              onChange={(e) =>
                setForm({ ...form, nickname: e.target.value })
              }
            />
            <input
              value={form.birthdate || ""}
              onChange={(e) =>
                setForm({ ...form, birthdate: e.target.value })
              }
            />
            <input
              value={form.phone || ""}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
            <button onClick={updateProfile}>Save</button>
          </>
        ) : (
          <>
            <h2>
              @{user.username}{" "}
              {user.role === "admin" && "👑"}
            </h2>
            <p>Email: {user.email || "—"}</p>
            <p>Nickname: {user.nickname || "—"}</p>
            <p>Birthdate: {user.birthdate || "—"}</p>
            <p>Phone: {user.phone || "—"}</p>
            <p>Role: {user.role}</p>
            <button onClick={() => setEdit(true)}>
              Edit Profile
            </button>
          </>
        )}

        {user.role === "admin" && (
          <button
            onClick={() =>
              (window.location.href = "/admin")
            }
          >
            Admin Panel
          </button>
        )}

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

const wrapper = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#1f1c2c",
};

const card = {
  background: "#2c2c3e",
  padding: "30px",
  borderRadius: "15px",
  color: "white",
  width: "400px",
};

const avatarBox = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const avatar = {
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  objectFit: "cover",
  marginBottom: "10px",
};

const avatarPlaceholder = {
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  background: "#6c5ce7",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "40px",
  marginBottom: "10px",
};

const center = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};