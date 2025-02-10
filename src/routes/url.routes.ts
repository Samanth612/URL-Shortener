import express from "express";
import {
  redirectToOriginalUrl,
  shortenUrl,
} from "../controllers/url.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { urlShortenLimiter } from "../middlewares/rateLimit.middleware";

const router = express.Router();

router.post("/", verifyToken, urlShortenLimiter, shortenUrl);
router.get("/:alias", redirectToOriginalUrl);

export default router;
