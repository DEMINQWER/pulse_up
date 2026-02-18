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
    <div className="vk-chats">

      <div className="vk-header">
        Чаты
      </div>

      <div className="vk-chat-list">
        {chats.length === 0 && (
          <div style={{ opacity: 0.6, padding: 20 }}>
            У вас пока нет диалогов
          </div>
        )}

        {chats.map(chat => (
          <Link key={chat.id} href={`/chats/${chat.id}`}>
            <div className="vk-chat-item">
              <div className="avatar">
                {chat.other_username?.[0]?.toUpperCase()}
              </div>

              <div>
                <div className="chat-name">
                  {chat.other_username}
                </div>
                <div className="chat-preview">
                  Нажмите чтобы открыть диалог
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}