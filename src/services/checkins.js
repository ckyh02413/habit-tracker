import { pool } from "../db.js";
import { ConflictError, NotFoundError } from "../errors.js";
import { getHabit } from "./habits.js";

export async function createCheckin(userId, habitId, date) {
  try {
    const result = await pool.query(
      "INSERT INTO checkins (habit_id, date) SELECT $1, COALESCE($2::date, CURRENT_DATE) FROM habits WHERE id=$1 AND user_id=$3 RETURNING *",
      [habitId, date ?? null, userId],
    );
    if (result.rows.length === 0) throw new NotFoundError("habit not found");
    return result.rows[0];
  } catch (err) {
    if (err.code === "23505")
      throw new ConflictError("already checked in for that date");
    throw err;
  }
}

export async function deleteCheckin(userId, habitId, date) {
  const result = await pool.query(
    "DELETE FROM checkins WHERE habit_id=$1 AND date=$2 AND habit_id IN (SELECT id FROM habits WHERE user_id=$3)",
    [habitId, date, userId],
  );
  if (result.rowCount === 0) throw new NotFoundError("habit not found");
}

export async function listCheckinsForHabit(userId, habitId) {
  await getHabit(userId, habitId);

  const result = await pool.query(
    "SELECT * FROM checkins WHERE habit_id=$1 ORDER BY date",
    [habitId],
  );
  return result.rows;
}
