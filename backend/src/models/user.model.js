import { db } from '../db.js';

export async function createUser(login, password, role='user') {
  await db.query(
    'INSERT INTO users (login, password, role) VALUES (?, ?, ?)',
    [login, password, role]
  );
}

export async function getUserByLogin(login) {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE login=?',
    [login]
  );
  return rows[0];
}