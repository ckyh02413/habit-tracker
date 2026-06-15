import { Router } from "express";
import { asyncH } from "../middleware/asyncH.js";
import { ValidationError } from "../errors.js";
import {
  createHabit,
  listHabitsForUser,
  getHabit,
  updateHabit,
  deleteHabit,
} from "../services/habits.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  asyncH(async (req, res) => {
    const userId = req.userId;
    const { name, target_per_week: rawTarget } = req.body;
    const targetPerWeek = Number(rawTarget);
    if (!name || !Number.isInteger(targetPerWeek) || targetPerWeek <= 0)
      throw new ValidationError("missing or invalid fields");
    const habit = await createHabit(userId, name, targetPerWeek);
    res.status(201).json(habit);
  }),
);

router.get(
  "/",
  authMiddleware,
  asyncH(async (req, res) => {
    const userId = req.userId;
    const habits = await listHabitsForUser(userId);
    res.status(200).json(habits);
  }),
);

router.get(
  "/:id",
  authMiddleware,
  asyncH(async (req, res) => {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
      throw new ValidationError("invalid id");
    const habit = await getHabit(userId, id);
    res.status(200).json(habit);
  }),
);

router.put(
  "/:id",
  authMiddleware,
  asyncH(async (req, res) => {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
      throw new ValidationError("invalid id");
    const { name, target_per_week: rawTarget } = req.body;
    const targetPerWeek = Number(rawTarget);
    if (!name || !Number.isInteger(targetPerWeek) || targetPerWeek <= 0)
      throw new ValidationError("missing or invalid fields");
    const habit = await updateHabit(userId, id, { name, targetPerWeek });
    res.status(200).json(habit);
  }),
);

router.delete(
  "/:id",
  authMiddleware,
  asyncH(async (req, res) => {
    const userId = req.userId;
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
      throw new ValidationError("invalid id");
    await deleteHabit(userId, id);
    res.status(204).end();
  }),
);

export default router;
