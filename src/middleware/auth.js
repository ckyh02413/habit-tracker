import jwt from "jsonwebtoken";
import { HttpError } from "../errors.js";
import "dotenv/config";
export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return next(new HttpError(401, "missing token"));

  const [header, token] = auth.split(" ");
  if (header !== "Bearer" || !token)
    return next(new HttpError(401, "invalid token"));
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    next(new HttpError(401, "invalid token"));
  }
}
