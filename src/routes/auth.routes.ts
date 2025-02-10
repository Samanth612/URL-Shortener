import express from "express";
import passport from "../middlewares/auth.middleware";
import jwt from "jsonwebtoken";
import env from "../config/env";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: any, res: any) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const token = jwt.sign({ id: req.user._id }, env.jwtSecret, {
      expiresIn: "7d",
    });

    res.json({ token, user: req.user });
  }
);

export default router;
