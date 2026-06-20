import { pool } from "../db.js";
import { getHabit } from "./habits.js";

export async function getCurrentStreak(userId, habitId) {
  await getHabit(userId, habitId);
  const result = await pool.query(
    "SELECT date FROM checkins WHERE habit_id=$1 AND date >=CURRENT_DATE - INTERVAL '400 days' ORDER BY date DESC",
    [habitId],
  );

  const dateSet = new Set(result.rows.map((r) => r.date));
  const fmt = (d) => d.toISOString().slice(0, 10);
  const cursor = new Date();
  if (!dateSet.has(fmt(cursor))) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (dateSet.has(fmt(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
export async function getLongestStreak(userId, habitId) {
  await getHabit(userId, habitId);
  const result = await pool.query(
    "SELECT date FROM checkins WHERE habit_id=$1 ORDER BY date ASC",
    [habitId],
  );
  const dates = result.rows.map((r) => r.date);
  if (dates.length === 0) return 0;

  let longest = 1;
  let current = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    if (curr - prev === 86400000) {
      current++;
    } else {
      current = 1;
    }
    longest = Math.max(longest, current);
  }
  return longest;
}

export async function getHeatmap(userId, habitId, days = 30) {
  await getHabit(userId, habitId);
  const result = await pool.query(
    "SELECT date FROM checkins WHERE habit_id=$1 AND date >= CURRENT_DATE - ($2 || 'days')::interval ORDER BY date ASC",
    [habitId, String(days - 1)],
  );

  const dateSet = new Set(result.rows.map((r) => r.date));

  const heatmap = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - (days - 1 - i));
    const dateStr = d.toISOString().slice(0, 10);
    return { date: dateStr, checked: dateSet.has(dateStr) };
  });

  return heatmap;
}
