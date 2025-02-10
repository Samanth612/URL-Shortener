import rateLimit from "express-rate-limit";

export const urlShortenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each user to 10 requests per windowMs
  message: {
    status: 429,
    message: "Too many requests. Please try again later.",
  },
  headers: true, // Send rate limit headers in response
  keyGenerator: (req: any) => req.user?.id || req.ip, // Identify user by ID or IP
});
