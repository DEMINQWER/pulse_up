"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { io } from "socket.io-client"

const socket = io(process.env.NEXT_PUBLIC_API_URL)

export default function ChatPage() {
  const { id } = useParams()
  const router = useRouter()
  const messagesEndRef = useRef(null)

  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const [userId, setUserId] = useState(null)
  const [chatName, setChatName] = useState("")
  const [otherUserId, setOtherUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [onlineUsers, setOnlineUsers] = useState([])

  /* ===== JWT ===== */

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    const decoded = JSON.parse(atob(token.split(".")[1]))
    setUserId(decoded.id)
    socket.emit("join", decoded.id)
  }, [])

  /* ===== LOAD DATA ===== */

  useEffect(() => {
    if (!id || !userId) return

    loadMessages()
    loadChatInfo()

    socket.emit("joinChat", id)

    socket.on("newMessage", (msg) => {
      if (String(msg.chat_id) !== String(id)) return

      setMessages(prev => [
        ...prev,
        { ...msg, isMine: msg.user_id === userId }
      ])
    })

    socket.on("userOnline", uid => {
      setOnlineUsers(prev => [...new Set([...prev, uid])])
    })

    socket.on("userOffline", uid => {
      setOnlineUsers(prev => prev.filter(id => id !== uid))
    })

    return () => socket.off()
  }, [id, userId])

  /* ===== LOAD CHAT INFO ===== */

  const loadChatInfo = async () => {
    const token = localStorage.getItem("token")

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/chats/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    const data = await res.json()

    setChatName(data.other_username)
    setOtherUserId(data.other_user_id)
  }

  /* ===== LOAD MESSAGES ===== */

  const loadMessages = async () => {
    setLoading(true)
    const token = localStorage.getItem("token")

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/messages/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    const data = await res.json()

    setMessages(
      data.map(m => ({
        ...m,
        isMine: m.user_id === userId
      }))
    )

    setLoading(false)
  }

  /* ===== SEND ===== */

  const sendMessage = async () => {
    if (!text.trim()) return

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

    const newMessage = await res.json()

    socket.emit("sendMessage", {
      ...newMessage,
      chatId: id
    })

    setText("")
  }

  const isOnline = onlineUsers.includes(otherUserId)

  return (
    <div className="chat-page-layout">

      {/* FIXED CHAT HEADER */}
      <div className="chat-header-fixed">
        <div className="chat-back" onClick={() => router.push("/chats")}>
          ←
        </div>

        <div className="chat-user-block">
          <div className="chat-user-name">
            {chatName}
          </div>

          <div className="chat-user-status">
            {isOnline ? "в сети" : "не в сети"}
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="chat-messages">
        {loading && <div>Загрузка...</div>}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`chat-bubble ${msg.isMine ? "mine" : "other"}`}
          >
            {msg.content}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Сообщение..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>➤</button>
      </div>

    </div>
  )
}