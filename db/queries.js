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

  return rows;
}
