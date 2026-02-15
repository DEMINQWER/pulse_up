const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function initDB() {
  try {

    /* ========= USERS ========= */

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        nickname TEXT,
        birthdate TEXT,
        phone TEXT,
        avatar_url TEXT,
        role TEXT DEFAULT 'user',
        is_banned BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    /* ========= SAFE MIGRATIONS ========= */

    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS nickname TEXT;`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS birthdate TEXT;`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false;`);

    /* ========= FIX BROKEN USERNAMES ========= */

    await pool.query(`
      UPDATE users
      SET username = 'user' || id
      WHERE username IS NULL OR username = '';
    `);

    /* ========= MAKE FIRST USER ADMIN ========= */

    await pool.query(`
      UPDATE users
      SET role = 'admin'
      WHERE id = 1
    `);

    /* ========= FRIENDS ========= */

    await pool.query(`
      CREATE TABLE IF NOT EXISTS friends (
        id SERIAL PRIMARY KEY,
        requester_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        addressee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(requester_id, addressee_id)
      );
    `);

    /* ========= CHATS ========= */

    await pool.query(`
      CREATE TABLE IF NOT EXISTS chats (
        id SERIAL PRIMARY KEY,
        is_group BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_users (
        chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(chat_id, user_id)
      );
    `);

    /* ========= MESSAGES ========= */

    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT,
        file_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    /* ========= REPORTS ========= */

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        reporter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        target_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(reporter_id, target_id)
      );
    `);

    console.log("✅ Database ready");

  } catch (err) {
    console.error("❌ DB INIT ERROR:", err);
  }
}

module.exports = { pool, initDB };