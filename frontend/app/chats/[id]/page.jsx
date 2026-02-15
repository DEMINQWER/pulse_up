"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ChatPage() {
  const { id } = useParams()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

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
    )

    const data = await res.json()

    if (!Array.isArray(data)) {
      setMessages([])
      return
    }

    const userId = JSON.parse(
      atob(token.split('.')[1])
    ).id

    const formatted = data.map((msg) => ({
      ...msg,
      isMine: msg.user_id === userId,
    }))

    setMessages(formatted)
  }

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

  return (
    <div className="chat-container">

      <div className="chat-header">
        <span>Диалог #{id}</span>
      </div>

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

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введите сообщение..."
        />

        <button onClick={sendMessage}>
          ➤
        </button>
      </div>
    </div>
  )
}