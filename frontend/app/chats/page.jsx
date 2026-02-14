"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Chats() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setChats);
  }, []);

  return (
    <div className="page">
      <h2>Чаты</h2>

      {chats.map(chat => (
        <Link key={chat.id} href={`/chats/${chat.id}`}>
          <div className="chat-item">
            Чат #{chat.id}
          </div>
        </Link>
      ))}
    </div>
  );
}