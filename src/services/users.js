import { pool } from "../db.js";
import bcrypt from "bcrypt";
import { HttpError, ConflictError, NotFoundError } from "../errors.js";

export async function createUser(name, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword],
    );
    return result.rows[0];
  } catch (err) {
    if (err.code === "23505") {
      throw new ConflictError("email already exists");
    }
    throw err;
  }
}

export async function verifyLogin(email, password) {
  const result = await pool.query(
    "SELECT id, name, email, password_hash FROM users WHERE email=$1",
    [email],
  );
  if (result.rows.length === 0) throw new HttpError(401, "invalid credentials");
  if (!(await bcrypt.compare(password, result.rows[0].password_hash)))
    throw new HttpError(401, "invalid credentials");
  return {
    id: result.rows[0].id,
    name: result.rows[0].name,
    email: email,
  };
}

export async function getUserById(id) {
  const result = await pool.query(
    "SELECT id, name, email FROM users WHERE id=$1",
    [id],
  );
  if (result.rows.length === 0) throw new NotFoundError("user not found");
  return result.rows[0];
}
