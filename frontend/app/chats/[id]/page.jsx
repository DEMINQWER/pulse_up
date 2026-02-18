"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"

export default function ChatPage() {
  const { id } = useParams()
  const router = useRouter()
  const messagesEndRef = useRef(null)

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loadChatInfo = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/chats/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    if (!res.ok) return

    const data = await res.json()
    setChatName(data.other_username)
  }

  const loadMessages = async () => {
    setLoading(true)

    const token = localStorage.getItem("token")
    if (!token) return

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/messages/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
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
  }

  const sendMessage = async () => {
    if (!text.trim() || sending) return

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

    setMessages(prev => [
      ...prev,
      { ...newMessage, isMine: true }
    ])

    setText("")
    setSending(false)
  }

  return (
    <div className="vk-chat-container">

      <div className="vk-chat-header">
        <div className="back-btn" onClick={() => router.back()}>
          ←
        </div>
        {chatName || "Загрузка..."}
      </div>

      <div className="vk-messages">
        {loading && <div style={{ opacity: 0.6 }}>Загрузка...</div>}

        {!loading && messages.length === 0 && (
          <div style={{ opacity: 0.6 }}>
            Сообщений пока нет
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`vk-message ${msg.isMine ? "mine" : "other"}`}
          >
            {msg.content}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="vk-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Сообщение..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage} disabled={sending}>
          ➤
        </button>
      </div>

    </div>
  )
}