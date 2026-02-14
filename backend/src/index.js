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

/* =================== */

initDB().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log('Server started');
  });
});