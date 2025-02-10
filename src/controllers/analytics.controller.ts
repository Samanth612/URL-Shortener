import { Request, Response } from "express";
import Url from "../models/url.model";
import { getUrlAnalytics } from "../services/url.service";
import AnalyticsModel from "../models/analytics.model";
import redisClient from "../config/redis";

export const getAnalytics = async (req: any, res: any) => {
  const { alias } = req.params;

  try {
    const analyticsData = await getUrlAnalytics(alias);
    return res.status(200).json(analyticsData);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTopicAnalytics = async (req: any, res: any) => {
  try {
    const { topic } = req.params;
    const cacheKey = `topicAnalytics:${topic}`;

    // 🛑 Check Redis cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("✅ Cache hit: Topic analytics");
      return res.json(JSON.parse(cachedData));
    }

    console.log("❌ Cache miss: Fetching from DB");

    // Fetch URLs for topic
    const urls = await Url.find({ topic });
    if (!urls.length) {
      return res.status(404).json({ message: "No URLs found for this topic" });
    }

    const urlAliases = urls.map((url) => url.shortUrl);

    // Aggregate analytics for topic
    const analytics = await AnalyticsModel.aggregate([
      { $match: { shortUrl: { $in: urlAliases } } },
      {
        $group: {
          _id: "$shortUrl",
          totalClicks: { $sum: 1 },
          uniqueUsers: { $addToSet: "$ipAddress" },
        },
      },
    ]);

    let totalClicks = 0;
    let uniqueUsersSet = new Set();

    const urlsAnalytics = analytics.map((entry) => {
      totalClicks += entry.totalClicks;
      entry.uniqueUsers.forEach((user: any) => uniqueUsersSet.add(user));

      return {
        shortUrl: entry._id,
        totalClicks: entry.totalClicks,
        uniqueUsers: entry.uniqueUsers.length,
      };
    });

    // Clicks by date
    const clicksByDate = await AnalyticsModel.aggregate([
      { $match: { shortUrl: { $in: urlAliases } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const analyticsData = {
      totalClicks,
      uniqueUsers: uniqueUsersSet.size,
      clicksByDate,
      urls: urlsAnalytics,
    };

    // ✅ Store in Redis (Expire after 30 mins)
    await redisClient.set(cacheKey, JSON.stringify(analyticsData), {
      EX: 60 * 30,
    });

    return res.json(analyticsData);
  } catch (error) {
    console.error("Error fetching topic analytics:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOverallAnalytics = async (req: any, res: any) => {
  try {
    const userId = req.user.id; // Ensure auth middleware provides req.user.id

    // 🛑 Check cache first
    const cachedData = await redisClient.get(`analytics:${userId}`);
    if (cachedData) {
      console.log("✅ Cache hit: Overall analytics");
      return res.json(JSON.parse(cachedData));
    }

    console.log("❌ Cache miss: Fetching from DB");

    // Fetch URLs created by user
    const urls = await Url.find({ userId });
    if (!urls.length) {
      return res.status(404).json({ message: "No URLs found for this user" });
    }

    const urlAliases = urls.map((url) => url.shortUrl);

    // Aggregate total clicks & unique users
    const analytics = await AnalyticsModel.aggregate([
      { $match: { shortUrl: { $in: urlAliases } } },
      {
        $group: {
          _id: null,
          totalClicks: { $sum: 1 },
          uniqueUsers: { $addToSet: "$ipAddress" },
        },
      },
    ]);

    const totalClicks = analytics.length ? analytics[0].totalClicks : 0;
    const uniqueUsers = analytics.length ? analytics[0].uniqueUsers.length : 0;

    // Clicks by date
    const clicksByDate = await AnalyticsModel.aggregate([
      { $match: { shortUrl: { $in: urlAliases } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Aggregate clicks by OS type
    const osType = await AnalyticsModel.aggregate([
      { $match: { shortUrl: { $in: urlAliases } } },
      {
        $group: {
          _id: "$osName",
          uniqueClicks: { $sum: 1 },
          uniqueUsers: { $addToSet: "$ipAddress" },
        },
      },
      {
        $project: {
          _id: 0,
          osName: "$_id",
          uniqueClicks: 1,
          uniqueUsers: { $size: "$uniqueUsers" },
        },
      },
    ]);

    // Aggregate clicks by device type
    const deviceType = await AnalyticsModel.aggregate([
      { $match: { shortUrl: { $in: urlAliases } } },
      {
        $group: {
          _id: "$deviceName",
          uniqueClicks: { $sum: 1 },
          uniqueUsers: { $addToSet: "$ipAddress" },
        },
      },
      {
        $project: {
          _id: 0,
          deviceName: "$_id",
          uniqueClicks: 1,
          uniqueUsers: { $size: "$uniqueUsers" },
        },
      },
    ]);

    // Final response
    const analyticsData = {
      totalUrls: urls.length,
      totalClicks,
      uniqueUsers,
      clicksByDate,
      osType,
      deviceType,
    };

    // ✅ Store in cache (Expire after 30 mins)
    await redisClient.set(
      `analytics:${userId}`,
      JSON.stringify(analyticsData),
      {
        EX: 60 * 30, // 30 minutes
      }
    );

    return res.json(analyticsData);
  } catch (error) {
    console.error("Error fetching overall analytics:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
