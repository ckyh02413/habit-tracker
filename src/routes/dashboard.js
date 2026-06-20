import { Router } from "express";
import { asyncH } from "../middleware/asyncH.js";
import { listHabitsForUser } from "../services/habits.js";
import { getCurrentStreak } from "../services/stats.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get(
  "/dashboard",
  authMiddleware,
  asyncH(async (req, res) => {
    const userId = req.userId;
    const habits = await listHabitsForUser(userId);
    const enriched = await Promise.all(
      habits.map(async (h) => ({
        ...h,
        current_streak: await getCurrentStreak(userId, h.id),
      })),
    );
    res.status(200).json(enriched);
  }),
);

export default router;
