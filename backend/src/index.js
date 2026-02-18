require("dotenv").config({ path: __dirname + "/../.env" })

const express = require("express")
const cors = require("cors")
const { initDB } = require("./db")
const path = require("path")
const http = require("http")
const { Server } = require("socket.io")
const admin = require("./firebaseAdmin")

const app = express()

/* =========================
   CORS
========================= */

app.use(
  cors({
    origin: [
      "https://pulse-front-goe7.onrender.com",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

app.options("*", cors())

app.use(express.json())

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
)

app.set("etag", false)

/* ===== ROUTES ===== */

app.use("/auth", require("./routes/auth"))
app.use("/chats", require("./routes/chats"))
app.use("/messages", require("./routes/messages"))
app.use("/admin", require("./routes/admin"))
app.use("/friends", require("./routes/friends"))
app.use("/users", require("./routes/users"))

/* ========================= */

app.get("/", (req, res) => {
  res.status(200).json({ status: "API работает" })
})

/* ========================= */

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err)
  res.status(500).json({ error: "Внутренняя ошибка сервера" })
})

/* =========================
   INIT DB + SOCKET
========================= */

initDB()
  .then(() => {
    const PORT = process.env.PORT || 5000

    const server = http.createServer(app)

    const io = new Server(server, {
      cors: {
        origin: [
          "https://pulse-front-goe7.onrender.com",
          "http://localhost:3000",
        ],
        credentials: true,
      },
    })

    io.on("connection", (socket) => {
      console.log("Socket подключён:", socket.id)

      socket.on("joinChat", (chatId) => {
        socket.join(chatId)
      })

      socket.on("sendMessage", async (message) => {
        // отправляем через сокет
        io.to(message.chatId).emit("newMessage", message)

        // 🔔 Отправляем PUSH через Firebase
        if (message.receiverDeviceToken) {
          try {
            await admin.messaging().send({
              token: message.receiverDeviceToken,
              notification: {
                title: `Новое сообщение`,
                body: message.content,
              },
              data: {
                chatId: String(message.chatId),
              },
            })

            console.log("Push отправлен")
          } catch (error) {
            console.error("Ошибка отправки push:", error)
          }
        }
      })

      socket.on("disconnect", () => {
        console.log("Socket отключён:", socket.id)
      })
    })

    server.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("Ошибка инициализации БД:", err)
  })