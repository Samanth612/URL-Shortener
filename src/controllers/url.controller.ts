import { createShortUrl } from "../services/url.service";
import { getOriginalUrl } from "../services/url.service";
import { logAnalytics } from "../services/analytics.service";
import redisClient from "../config/redis";

export const shortenUrl = async (req: any, res: any) => {
  try {
    const { longUrl, customAlias, topic } = req.body;
    const userId = req.user.id; // User ID from authentication middleware

    if (!longUrl) {
      return res.status(400).json({ message: "Long URL is required" });
    }

    // Create a new short URL
    const url = await createShortUrl(longUrl, userId, customAlias, topic);

    // Store short URL mapping in Redis for faster lookups
    await redisClient.set(`shortUrl:${url.shortUrl}`, longUrl, {
      EX: 60 * 60 * 24, // Cache for 24 hours
    });

    // Clear analytics cache because a new URL is added
    await redisClient.del(`analytics:${userId}`);

    return res.status(201).json({
      shortUrl: `${req.protocol}://${req.get("host")}/api/shorten/${
        url.shortUrl
      }`,
      createdAt: url.createdAt,
    });
  } catch (error) {
    return res.status(500).json({ message: (error as any).message });
  }
};

export const redirectToOriginalUrl = async (req: any, res: any) => {
  try {
    const { alias } = req.params;

    // Check Redis cache first for quick redirection
    const cachedLongUrl = await redisClient.get(`shortUrl:${alias}`);
    if (cachedLongUrl) {
      console.log("Cache hit ✅ - Redirecting immediately!");
      await logAnalytics(
        alias,
        req.headers["user-agent"] || "Unknown",
        req.ip || "Unknown"
      );
      return res.redirect(cachedLongUrl);
    }

    console.log("Cache miss ❌ - Fetching from DB...");

    // Fetch from DB if not cached
    const longUrl = await getOriginalUrl(alias);
    if (!longUrl) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    // Store in Redis for future fast lookups
    await redisClient.set(`shortUrl:${alias}`, longUrl, {
      EX: 60 * 60 * 24, // Cache for 24 hours
    });

    // Log analytics after redirect
    await logAnalytics(
      alias,
      req.headers["user-agent"] || "Unknown",
      req.ip || "Unknown"
    );

    return res.redirect(longUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
