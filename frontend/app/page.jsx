'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: "AIzaSyD2AdlHV28ToJeF9aRE0bZkZS3Ji8rXbDc",
  authDomain: "pulse-adb59.firebaseapp.com",
  projectId: "pulse-adb59",
  storageBucket: "pulse-adb59.firebasestorage.app",
  messagingSenderId: "345870057911",
  appId: "1:345870057911:web:89f6bbb960760bbbea832",
}

const app = initializeApp(firebaseConfig)

export default function HomePage() {
  const router = useRouter()

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null

  useEffect(() => {
    if (!token) return

    const initPush = async () => {
      try {
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') return

        const messaging = getMessaging(app)

        const currentToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        })

        if (currentToken) {
          console.log('FCM TOKEN:', currentToken)

          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/device-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ token: currentToken }),
          })
        }
      } catch (err) {
        console.error('Push init error:', err)
      }
    }

    initPush()
  }, [token])

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