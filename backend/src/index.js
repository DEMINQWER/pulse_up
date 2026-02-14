require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

const path = require('path');

app.use('/uploads', express.static(
  path.join(__dirname, '../uploads')
));

app.set('etag', false);

app.use('/auth', require('./routes/auth'));

// 🔥 ВАЖНО — подключаем твой chats.js
app.use('/chats', require('./routes/chats'));

app.use('/messages', require('./routes/messages'));
app.use('/admin', require('./routes/admin'));
app.use("/friends", require("./src/routes/friends"));
app.use("/users", require("./src/routes/users"));

initDB().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log('Server started');
  });
});