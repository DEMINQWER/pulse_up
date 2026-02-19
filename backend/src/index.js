require("dotenv").config({ path: __dirname + "/../.env" });

const express = require("express");
const cors = require("cors");
const { initDB, pool } = require("./db");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const admin = require("./firebaseAdmin");

const app = express();

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
);

app.options("*", cors());

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

app.set("etag", false);

/* ===== ROUTES ===== */

app.use("/auth", require("./routes/auth"));
app.use("/chats", require("./routes/chats"));
app.use("/messages", require("./routes/messages"));
app.use("/admin", require("./routes/admin"));
app.use("/friends", require("./routes/friends"));
app.use("/users", require("./routes/users"));

/* ========================= */

app.get("/", (req, res) => {
  res.status(200).json({ status: "API работает" });
});

/* ========================= */

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

/* =========================
   INIT DB + SOCKET
========================= */

initDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: [
          "https://pulse-front-goe7.onrender.com",
          "http://localhost:3000",
        ],
        credentials: true,
      },
    });

    app.set("io", io);

    const onlineUsers = new Map();

    io.on("connection", (socket) => {
      console.log("🔌 Socket подключён:", socket.id);

      /* ===== USER ONLINE ===== */

      socket.on("join", (userId) => {
        onlineUsers.set(userId, socket.id);
        socket.userId = userId;

        io.emit("userOnline", userId);
      });

      /* ===== JOIN CHAT ===== */

      socket.on("joinChat", (chatId) => {
        socket.join(`chat_${chatId}`);
      });

      /* ===== SEND MESSAGE ===== */

      socket.on("sendMessage", async (message) => {
        try {
          const result = await pool.query(
            `INSERT INTO messages (chat_id, user_id, content, status)
             VALUES ($1, $2, $3, 'sent')
             RETURNING *`,
            [message.chatId, message.senderId, message.content]
          );

          const newMessage = result.rows[0];

          io.to(`chat_${message.chatId}`).emit("newMessage", newMessage);

          // если получатель онлайн → delivered
          if (onlineUsers.has(message.receiverId)) {
            await pool.query(
              `UPDATE messages SET status = 'delivered' WHERE id = $1`,
              [newMessage.id]
            );

            io.to(`chat_${message.chatId}`).emit("messageDelivered", {
              messageId: newMessage.id,
            });
          }

          // 🔔 PUSH
          if (message.receiverDeviceToken) {
            await admin.messaging().send({
              token: message.receiverDeviceToken,
              notification: {
                title: "Новое сообщение",
                body: message.content,
              },
              data: {
                chatId: String(message.chatId),
              },
            });
          }
        } catch (err) {
          console.error("Ошибка sendMessage:", err);
        }
      });

      /* ===== READ ===== */

      socket.on("messageRead", async ({ chatId, userId }) => {
        try {
          await pool.query(
            `UPDATE messages
             SET status = 'read'
             WHERE chat_id = $1
             AND user_id != $2`,
            [chatId, userId]
          );

          io.to(`chat_${chatId}`).emit("messagesRead", { chatId });
        } catch (err) {
          console.error("Ошибка read:", err);
        }
      });

      /* ===== DISCONNECT ===== */

      socket.on("disconnect", () => {
        if (socket.userId) {
          onlineUsers.delete(socket.userId);
          io.emit("userOffline", socket.userId);
        }

        console.log("❌ Socket отключён:", socket.id);
      });
    });

    server.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Ошибка инициализации БД:", err);
  });