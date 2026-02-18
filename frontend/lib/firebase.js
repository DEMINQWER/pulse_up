import { initializeApp } from "firebase/app"
import { getMessaging, getToken, onMessage } from "firebase/messaging"

const firebaseConfig = {
  apiKey: "ТВОЙ_API_KEY",
  authDomain: "ТВОЙ_AUTH_DOMAIN",
  projectId: "ТВОЙ_PROJECT_ID",
  storageBucket: "ТВОЙ_STORAGE_BUCKET",
  messagingSenderId: "ТВОЙ_MESSAGING_SENDER_ID",
  appId: "ТВОЙ_APP_ID"
}

const app = initializeApp(firebaseConfig)

export const messaging = getMessaging(app)

export const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission()
  if (permission !== "granted") return null

  const token = await getToken(messaging, {
    vapidKey: "ТВОЙ_PUBLIC_VAPID_KEY"
  })

  return token
}

export const listenForegroundMessages = (callback) => {
  onMessage(messaging, (payload) => {
    callback(payload)
  })
}