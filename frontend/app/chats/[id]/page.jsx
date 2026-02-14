"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ChatPage() {
  const { id } = useParams()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  // ✅ новые state
  const [newUserId, setNewUserId] = useState('')
  const [showAddUser, setShowAddUser] = useState(false)

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null

  useEffect(() => {
    if (!id) return
    loadMessages()
  }, [id])

  const loadMessages = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/messages/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!Array.isArray(data)) {
      setMessages([]);
      return;
    }

    const userId = JSON.parse(
      atob(token.split('.')[1])
    ).id;

    const formattedMessages = data.map((msg) => ({
      ...msg,
      isMine: msg.user_id === userId,
    }));

    setMessages(formattedMessages);
  };

  const sendMessage = async () => {
    if (!text.trim()) return

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/messages/${id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: text }),
      }
    )

    setText('')
    loadMessages()
  }

  // ✅ добавление участника
  const addUser = async () => {
    if (!newUserId.trim()) return

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/chats/${id}/users`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: newUserId }),
      }
    )

    if (res.ok) {
      setNewUserId('')
      setShowAddUser(false)
      alert('Пользователь добавлен')
    } else {
      alert('Ошибка или вы не владелец группы')
    }
  }

  return (
    <div className="chat-container">
      
      {/* HEADER */}
      <div className="chat-header">
        <span>Chat #{id}</span>

        <button
          onClick={() => setShowAddUser(!showAddUser)}
          style={{ marginLeft: 10 }}
        >
          ➕
        </button>
      </div>

      {/* Форма добавления участника */}
      {showAddUser && (
        <div style={{ padding: 10 }}>
          <input
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
            placeholder="Введите ID пользователя"
          />
          <button onClick={addUser} style={{ marginLeft: 5 }}>
            Добавить
          </button>
        </div>
      )}

      {/* MESSAGES */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              msg.isMine ? 'mine' : 'other'
            }`}
          >
            <div className="message-content">
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <button className="attach-btn">📎</button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введите сообщение..."
        />

        <button onClick={sendMessage} className="send-btn">
          ➤
        </button>
      </div>
    </div>
  )
}