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
