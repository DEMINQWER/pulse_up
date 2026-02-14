'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ChatsPage() {
  const [chats, setChats] = useState([])
  const [title, setTitle] = useState('')
  const router = useRouter()

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null

  useEffect(() => {
    if (!token) {
      router.push('/')
      return
    }

    loadChats()
  }, [])

  const loadChats = async () => {
    try {
      const res = await fetch('https://pulse-9ui4.onrender.com/chats', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        cache: 'no-store'
      })

      const data = await res.json()
      setChats(data.chats || [])
    } catch (err) {
      console.error('Ошибка загрузки чатов:', err)
    }
  }

  const createChat = async () => {
    if (!title.trim()) return

    try {
      await fetch('https://pulse-9ui4.onrender.com/chats/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          is_group: true
        }),
        cache: 'no-store'
      })

      setTitle('')
      await loadChats()
    } catch (err) {
      console.error('Ошибка создания чата:', err)
    }
  }

  return (
    <div className="container">
      <h1 className="title">Чаты</h1>

      <div className="chat-list">
        {chats.map((chat) => (
          <div
            key={chat._id}
            className="chat-item"
            onClick={() => router.push(`/chats/${chat._id}`)}
          >
            <div className="chat-title">
              {chat.title}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 30 }}>
        <input
          placeholder="Введите название чата"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          className="primary-btn"
          style={{ marginTop: 15 }}
          onClick={createChat}
        >
          Создать чат
        </button>
      </div>
    </div>
  )
}