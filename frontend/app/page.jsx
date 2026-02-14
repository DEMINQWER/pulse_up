'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null

  useEffect(() => {
    if (!token) return
  }, [])

  if (!token) {
    return (
      <div className="container">
        <div className="card">
          <h1 className="title">PULSE</h1>
          <p style={{ marginBottom: 20 }}>Будь в ритме общения</p>

          <button
            className="primary-btn"
            onClick={() => router.push('/login')}
          >
            Войти
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="title">Лента</h1>

      <div className="card">
        Здесь будет новостная лента пользователей
      </div>
    </div>
  )
}