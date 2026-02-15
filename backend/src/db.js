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
        ban_reason TEXT,
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
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS ban_reason TEXT;`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);

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
      WHERE email = 'lioasq.joude@mail.ru'
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
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(reporter_id, target_id)
      );
    `);

    /* ========= ADMIN LOGS ========= */

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_logs (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        target_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        action TEXT NOT NULL,
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    /* ========= INDEXES (Performance) ========= */

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_created_at
      ON users(created_at);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at
      ON admin_logs(created_at);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_reports_target
      ON reports(target_id);
    `);

    console.log("✅ Database ready");

  } catch (err) {
    console.error("❌ DB INIT ERROR:", err);
  }
}

module.exports = { pool, initDB };