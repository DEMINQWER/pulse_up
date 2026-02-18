"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function FriendsPage() {
  const router = useRouter()

  const [friends, setFriends] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFriends()
  }, [])

  const loadFriends = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/friends`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    if (!res.ok) {
      setLoading(false)
      return
    }

    const data = await res.json()
    setFriends(data)
    setLoading(false)
  }

  const filtered = friends.filter(friend =>
    friend.username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="pulse-container">

      <div className="pulse-header">
        👥 Друзья
      </div>

      <div className="pulse-search">
        <input
          placeholder="Поиск по username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="pulse-list">

        {loading && <div className="empty">Загрузка...</div>}

        {!loading && filtered.length === 0 && (
          <div className="empty">Друзей пока нет</div>
        )}

        {filtered.map(friend => (
          <div key={friend.id} className="pulse-card">

            <div className="pulse-avatar">
              {friend.username[0].toUpperCase()}
            </div>

            <div className="pulse-info">
              <div className="pulse-name">
                {friend.username}
              </div>
              <div className="pulse-sub">
                @{friend.username}
              </div>
            </div>

            <button
              className="pulse-btn"
              onClick={() => router.push(`/chats/${friend.chat_id}`)}
            >
              Написать
            </button>

          </div>
        ))}

      </div>
    </div>
  )
}