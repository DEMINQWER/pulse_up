"use client"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"

export default function ChatPage() {

  const { id } = useParams()
  const router = useRouter()

  const userId = "me"

  const [messages, setMessages] = useState([
    { _id: 1, sender: "other", text: "Привет!" },
    { _id: 2, sender: "me", text: "Здарова" }
  ])

  const [text, setText] = useState("")

  const sendMessage = () => {
    if (!text.trim()) return

    setMessages([
      ...messages,
      { _id: Date.now(), sender: "me", text }
    ])

    setText("")
  }

  return (
    <div className="chat-page">

      <div className="chat-header">
        <button onClick={() => router.back()}>←</button>
        <div style={{marginLeft: 10}}>
          <div>User {id}</div>
          <small style={{opacity: 0.6}}>online</small>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map(msg => (
          <div
            key={msg._id}
            className={`chat-bubble ${msg.sender === "me" ? "mine" : "other"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Написать сообщение..."
        />
        <button onClick={sendMessage}>➤</button>
      </div>

    </div>
  )
}