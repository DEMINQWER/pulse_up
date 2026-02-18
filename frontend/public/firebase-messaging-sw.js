importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js")

firebase.initializeApp({
  apiKey: "AIzaSyD2AdlHV28T0JeF9aRE0bZkZS3Ji8rXbDc",
  authDomain: "pulse-adb59.firebaseapp.com",
  projectId: "pulse-adb59",
  storageBucket: "pulse-adb59.firebasestorage.app",
  messagingSenderId: "345870057911",
  appId: "1:345870057911:web:89f6bbb9600760bbbea832"
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon-192.png"
  })
})