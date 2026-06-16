import { Router } from "express";
import { asyncH } from "../middleware/asyncH.js";
import { ValidationError } from "../errors.js";
import {
  createCheckin,
  deleteCheckin,
  listCheckinsForHabit,
} from "../services/checkins.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post(
  "/habits/:id/checkins",
  authMiddleware,
  asyncH(async (req, res) => {
    const userId = req.userId;
    const habitId = Number(req.params.id);
    if (!Number.isInteger(habitId) || habitId <= 0)
      throw new ValidationError("invalid id");
    const date = req.body.date;
    if (date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(date))
      throw new ValidationError("date must be YYYY-MM-DD");
    const checkin = await createCheckin(userId, habitId, date);
    res.status(201).json(checkin);
  }),
);

router.delete(
  "/habits/:id/checkins/:date",
  authMiddleware,
  asyncH(async (req, res) => {
    const userId = req.userId;
    const habitId = Number(req.params.id);
    if (!Number.isInteger(habitId) || habitId <= 0)
      throw new ValidationError("invalid id");
    const date = req.params.date;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
      throw new ValidationError("date must be YYYY-MM-DD");
    await deleteCheckin(userId, habitId, date);
    res.status(204).end();
  }),
);

export default router;
