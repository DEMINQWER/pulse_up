"use client";

import { useEffect, useState } from "react";

export default function Profile({ userId }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Получаем токен из localStorage
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (!stored) return;

    setToken(stored);

    try {
      const payload = JSON.parse(atob(stored.split(".")[1]));
      setCurrentUserId(payload.id);
    } catch (err) {
      console.error("Invalid token");
    }
  }, []);

  // Загружаем пользователя только если есть token и userId
  useEffect(() => {
    if (!token || !userId) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setUser)
      .catch(err => console.error(err));
  }, [token, userId]);

  if (!user) return <div>Loading...</div>;

  const isOwner = currentUserId === userId;

  const startChat = async () => {
    if (!token) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/chats/start`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      }
    );

    const data = await res.json();
    window.location.href = `/chats/${data.chatId}`;
  };

  return (
    <div className="card">
      <div className="avatar-wrapper">
        <img
          src={user.avatar_url || "/default-avatar.png"}
          alt="avatar"
        />
        {isOwner && <div className="avatar-edit">✏️</div>}
      </div>

      <h2>{user.nickname}</h2>
      <p>@{user.username}</p>
      <p>{user.birthdate}</p>
      <p>{user.phone}</p>

      {!isOwner && (
        <button className="primary-btn" onClick={startChat}>
          Написать сообщение
        </button>
      )}
    </div>
  );
}