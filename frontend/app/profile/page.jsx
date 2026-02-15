"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No token found");
        }

        const res = await fetch(
          "https://pulse-9ui4.onrender.com/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div style={styles.center}>Loading profile...</div>;
  }

  if (error) {
    return <div style={styles.center}>{error}</div>;
  }

  if (!user) {
    return <div style={styles.center}>No user data</div>;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.avatar}>
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="avatar"
              style={styles.avatarImage}
            />
          ) : (
            <div style={styles.avatarPlaceholder}>
              {user.username?.[0]?.toUpperCase()}
            </div>
          )}
        </div>

        <h2 style={styles.username}>
          @{user.username}
          {user.role === "admin" && (
            <span style={styles.crown}> 👑</span>
          )}
        </h2>

        <div style={styles.infoBlock}>
          <ProfileRow label="ID" value={user.id} />
          <ProfileRow label="Email" value={user.email} />
          <ProfileRow label="Nickname" value={user.nickname} />
          <ProfileRow label="Birthdate" value={user.birthdate} />
          <ProfileRow label="Phone" value={user.phone} />
          <ProfileRow label="Role" value={user.role} />
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div style={styles.row}>
      <span style={styles.label}>{label}</span>
      <span style={styles.value}>{value || "—"}</span>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1f1c2c, #302b63, #24243e)",
    padding: "20px",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "40px",
    width: "420px",
    color: "white",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
  },
  avatar: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  avatarImage: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  avatarPlaceholder: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "#6c5ce7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "40px",
    fontWeight: "bold",
  },
  username: {
    textAlign: "center",
    marginBottom: "20px",
  },
  crown: {
    color: "gold",
  },
  infoBlock: {
    marginTop: "20px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    paddingBottom: "6px",
  },
  label: {
    opacity: 0.7,
  },
  value: {
    fontWeight: "bold",
  },
  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#1f1c2c",
    color: "white",
  },
};