import { pool } from "./pool.js";

export async function createUser(form) {
  const { rows } = await pool.query(
    `
        INSERT INTO users (username, full_name, password)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
    [form.username, form.full_name, form.passwordHash]
  );

  return rows[0];
}

export async function findUserByName(username) {
  const { rows } = await pool.query(
    `
        SELECT * FROM users WHERE username = $1`,
    [username]
  );

  return rows[0];
}

export async function findUserById(id) {
  const { rows } = await pool.query(
    `
        SELECT * FROM users WHERE id = $1`,
    [id]
  );
  return rows[0];
}

export async function createMessage(userId, title, body) {
  const { rows } = await pool.query(
    `
        INSERT INTO messages (user_id, title, body)
            VALUES($1, $2, $3);
        `,
    [userId, title, body]
  );
}

export async function getAllMessages() {
  const { rows } = await pool.query(
    `SELECT messages.id, messages.title, messages.body, messages.created_at,
            users.full_name AS author, users.is_member
     FROM messages
     LEFT JOIN users ON messages.user_id = users.id
     ORDER BY messages.created_at DESC`
  );
  return rows;
}

export async function dropAllMessages() {
  const { rows } = await pool.query(`DELETE FROM messages;`);
  return rows;
}

export async function makeUserMember(userId) {
  await pool.query(`UPDATE users SET is_member = true WHERE id = $1`, [userId]);
}

export async function removeMembership(userId) {
  await pool.query(`UPDATE users SET is_member = false WHERE id = $1`, [
    userId,
  ]);
}

export async function deleteMessageById(messageId) {
  const { rows } = await pool.query(`DELETE FROM messages WHERE id = $1`, [
    messageId,
  ]);
  console.log(rows);
}
