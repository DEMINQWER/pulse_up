"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const router = useRouter();

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API}/friends`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setFriends);
  }, []);

  const searchUser = async () => {
    const token = localStorage.getItem("token");
    if (!search || !token) return;

    const res = await fetch(`${API}/users/search?username=${search}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    setResults(data);
  };

  const startChat = async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${API}/chats/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ userId })
    });

    const data = await res.json();
    router.push(`/chats/${data.chatId}`);
  };

  return (
    <div className="page">
      <h2>Друзья</h2>

      <div className="search-box">
        <input
          placeholder="Поиск по username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={searchUser}>Поиск</button>
      </div>

      {results.length > 0 && (
        <div className="search-results">
          {results.map((user) => (
            <div key={user.id} className="user-card">
              <span>@{user.username}</span>
              <button onClick={() => startChat(user.id)}>
                Написать
              </button>
            </div>
          ))}
        </div>
      )}

      <hr />

      <div className="friends-list">
        {friends.map((friend) => (
          <div key={friend.id} className="friend-item">
            <span>@{friend.username}</span>
            <button onClick={() => startCha(friend.id)}>
              Открыть чат
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}