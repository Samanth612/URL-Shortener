import express from "express";
import {
  getAnalytics,
  getOverallAnalytics,
  getTopicAnalytics,
} from "../controllers/analytics.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/overall", verifyToken, getOverallAnalytics);

router.get("/:alias", getAnalytics);

router.get("/topic/:topic", verifyToken, getTopicAnalytics);

export default router;
