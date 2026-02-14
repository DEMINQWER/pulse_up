"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getChats } from "@/lib/chats";
import { getToken } from "@/lib/auth";

export default function FeedPage() {
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
const [title, setTitle] = useState('')

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const data = await getChats();
      setChats(data);
      console.log(chats);
    } catch (err) {
      console.error(err);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.wrapper}>
        <h2 style={{ color: "white" }}>Загрузка...</h2>
      </div>
    );
  }

  const createChat = async () => {
  if (!title.trim()) return;

  try {
    const token = getToken();

    const res = await fetch("https://pulse-9ui4.onrender.com/chats/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        is_group: true
      })
    });

    if (!res.ok) {
      const err = await res.text();
      console.log("Ошибка:", err);
      return;
    }

    setTitle("");
    await loadChats();

  } catch (err) {
    console.error(err);
  }
};

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Мои чаты</h1>

        <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
  <input
    placeholder="Название чата"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    style={{
      flex: 1,
      padding: "8px",
      borderRadius: "8px",
      border: "none",
      outline: "none",
    }}
  />
  <button
    onClick={createChat}
    style={{
      padding: "8px 14px",
      borderRadius: "8px",
      border: "none",
      background: "#1cc88a",
      color: "white",
      cursor: "pointer",
    }}
  >
    +
  </button>
</div>

        {chats.length === 0 && (
          <p style={{ color: "#aaa" }}>У вас пока нет чатов</p>
        )}

        {chats.map((chat) => (
  <div
    key={chat.id}
    style={styles.chatItem}
    onClick={() => router.push(`/chats/${chat.id}`)}
  >
            
          
            <div>
              <strong>{chat.title}</strong>
              <div style={styles.lastMessage}>
                {chat.last_message || "Нет сообщений"}
              </div>
            </div>

            {chat.unread_count > 0 && (
              <div style={styles.badge}>{chat.unread_count}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0f1a, #1a1a2e)",
    display: "flex",
    justifyContent: "center",
    paddingTop: "60px",
  },

  card: {
    width: "420px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 0 40px rgba(0, 0, 255, 0.3)",
  },

  title: {
    color: "white",
    marginBottom: "20px",
  },

  chatItem: {
    padding: "15px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.08)",
    marginBottom: "12px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  lastMessage: {
    fontSize: "12px",
    color: "#aaa",
    marginTop: "4px",
  },

  badge: {
    background: "#1cc88a",
    color: "white",
    borderRadius: "20px",
    padding: "4px 10px",
    fontSize: "12px",
  },
};