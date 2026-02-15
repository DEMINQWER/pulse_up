require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');
const path = require('path');

const app = express();

/* =========================
   CORS ONLY FOR RENDER
========================= */

app.use(cors({
  origin: "https://pulse-front-goe7.onrender.com",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

/* ========================= */

app.use(express.json());

app.use('/uploads', express.static(
  path.join(__dirname, '../uploads')
));

app.set('etag', false);

/* ===== ROUTES ===== */

app.use('/auth', require('./routes/auth'));
app.use('/chats', require('./routes/chats'));
app.use('/messages', require('./routes/messages'));
app.use('/admin', require('./routes/admin'));
app.use('/friends', require('./routes/friends'));
app.use('/users', require('./routes/users'));

/* =========================
   ROOT CHECK (ВАЖНО)
========================= */

app.get('/', (req, res) => {
  res.status(200).json({ status: "API is working" });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

/* ========================= */

initDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB INIT ERROR:", err);
  });