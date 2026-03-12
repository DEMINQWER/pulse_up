"use client"
import Link from "next/link"

export default function ChatsPage() {

  const chats = [
    { id: "1", username: "Elon", last: "Привет!" },
    { id: "2", username: "Admin", last: "Добро пожаловать" }
  ]

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h2>Чаты</h2>
      </div>

      <div className="chat-messages">
        {chats.map(chat => (
          <Link key={chat.id} href={`/chats/${chat.id}`}>
            <div className="chat-bubble other" style={{cursor: "pointer"}}>
              <strong>{chat.username}</strong>
              <div style={{fontSize: "12px", opacity: 0.7}}>
                {chat.last}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}