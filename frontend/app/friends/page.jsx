"use client";
import { useEffect, useState } from "react";

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/friends`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setFriends)
      .catch(err => console.error(err));
  }, [token]);

  return (
    <div className="container">
      <h2 className="title">Друзья</h2>

      <div className="chat-list">
        {friends.map(friend => (
          <div
            key={friend.id}
            className="chat-item"
            onClick={() =>
              window.location.href = `/profile/${friend.id}`
            }
          >
            {friend.nickname || friend.username}
          </div>
        ))}

        {!friends.length && (
          <p style={{ opacity: 0.6 }}>
            У вас пока нет друзей
          </p>
        )}
      </div>
    </div>
  );
}