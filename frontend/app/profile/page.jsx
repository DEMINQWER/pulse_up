"use client";
import { useEffect, useState } from "react";

export default function Profile({ userId }) {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setUser);
  }, [userId]);

  if (!user) return null;

  const isOwner = userId === JSON.parse(atob(token.split(".")[1])).id;

  const startChat = async () => {
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