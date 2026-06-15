import express from "express";
import authRouter from "./routes/auth.js";
import habitsRouter from "./routes/habits.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { pool } from "./db.js";

const app = express();
app.use(express.json());
app.use(authRouter);
app.use("/habits", habitsRouter);
app.use((req, res) => res.status(404).json({ error: "not found" }));
app.use(errorHandler);

export { app, pool };
