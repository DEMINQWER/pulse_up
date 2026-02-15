"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function ChatPage() {
  const { id } = useParams()

  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const [userId, setUserId] = useState(null)
  const [chatName, setChatName] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]))
      setUserId(decoded.id)
    } catch (err) {
      console.error("JWT decode error", err)
    }
  }, [])

  useEffect(() => {
    if (!id || !userId) return
    loadMessages()
    loadChatInfo()
  }, [id, userId])

  const loadChatInfo = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/chats/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    if (!res.ok) return

    const data = await res.json()
    setChatName(data.other_username)
  }

  const loadMessages = async () => {
    try {
      setLoading(true)

      const token = localStorage.getItem("token")
      if (!token) return

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/messages/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) {
        setMessages([])
        setLoading(false)
        return
      }

      const data = await res.json()

      const formatted = data.map((msg) => ({
        ...msg,
        isMine: msg.user_id === userId,
      }))

      setMessages(formatted)
      setLoading(false)

    } catch (err) {
      console.error("Load messages error:", err)
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!text.trim() || sending) return

    try {
      setSending(true)

      const token = localStorage.getItem("token")

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/messages/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: text }),
        }
      )

      if (!res.ok) {
        setSending(false)
        return
      }

      const newMessage = await res.json()

      setMessages((prev) => [
        ...prev,
        {
          ...newMessage,
          isMine: true,
        },
      ])

      setText("")
      setSending(false)

    } catch (err) {
      console.error("Send error:", err)
      setSending(false)
    }
  }

  return (
    <div className="chat-container">

      <div className="chat-header">
        <span>{chatName || "Загрузка..."}</span>
      </div>

      <div className="chat-messages">

        {loading && <div>Загрузка...</div>}

        {!loading && messages.length === 0 && (
          <div style={{ opacity: 0.6 }}>
            Сообщений пока нет
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              msg.isMine ? "mine" : "other"
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
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage()
          }}
        />

        <button onClick={sendMessage} disabled={sending}>
          {sending ? "..." : "➤"}
        </button>
      </div>

    </div>
  )
}