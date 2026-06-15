import { Router } from "express";
import { asyncH } from "../middleware/asyncH.js";
import { ValidationError } from "../errors.js";
import { createUser, verifyLogin, getUserById } from "../services/users.js";
import { authMiddleware } from "../middleware/auth.js";
import "dotenv/config";
import jwt from "jsonwebtoken";
const router = Router();

router.post(
  "/signup",
  asyncH(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      throw new ValidationError("missing fields");
    const user = await createUser(name, email, password);
    res.status(201).json(user);
  }),
);

router.post(
  "/login",
  asyncH(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new ValidationError("missing fields");
    const user = await verifyLogin(email, password);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  }),
);

router.get(
  "/me",
  authMiddleware,
  asyncH(async (req, res) => {
    const userId = req.userId;
    const user = await getUserById(userId);
    res.status(200).json(user);
  }),
);

export default router;
