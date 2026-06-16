import { pool } from "../db.js";
import { ConflictError, NotFoundError, ValidationError } from "../errors.js";
export async function createHabit(userId, name, targetPerWeek) {
  try {
    const result = await pool.query(
      "INSERT INTO habits (user_id, name, target_per_week) VALUES ($1, $2, $3) RETURNING *",
      [userId, name, targetPerWeek],
    );
    return result.rows[0];
  } catch (err) {
    if (err.code === "23514")
      throw new ValidationError("target_per_week must be 1-7");

    if (err.code === "23505")
      throw new ConflictError("habit with this name already exists");
    throw err;
  }
}

export async function listHabitsForUser(userId) {
  const result = await pool.query(
    "SELECT * FROM habits WHERE user_id=$1 ORDER BY created_at DESC",
    [userId],
  );
  return result.rows;
}

export async function getHabit(userId, habitId) {
  const result = await pool.query(
    "SELECT * FROM habits WHERE user_id=$1 AND id=$2",
    [userId, habitId],
  );
  if (result.rows.length === 0) throw new NotFoundError("habit not found");
  return result.rows[0];
}

export async function updateHabit(userId, habitId, fields) {
  const { name, targetPerWeek } = fields;
  if (!name || !targetPerWeek)
    throw new ValidationError("name and target_per_week required");
  try {
    const result = await pool.query(
      "UPDATE habits SET name=$1, target_per_week=$2 WHERE user_id=$3 AND id=$4 RETURNING *",
      [name, targetPerWeek, userId, habitId],
    );
    if (result.rows.length === 0) throw new NotFoundError("habit not found");
    return result.rows[0];
  } catch (err) {
    if (err.code === "23505")
      throw new ConflictError("habit with this name already exists");
    if (err.code === "23514")
      throw new ValidationError("target_per_week must be 1-7");
    throw err;
  }
}

export async function deleteHabit(userId, habitId) {
  const result = await pool.query(
    "DELETE FROM habits WHERE user_id=$1 AND id=$2",
    [userId, habitId],
  );
  if (result.rowCount === 0) throw new NotFoundError("habit not found");
}
