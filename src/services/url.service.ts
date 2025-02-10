import shortid from "shortid";
import Url from "../models/url.model";
import AnalyticsModel from "../models/analytics.model";
import redisClient from "../config/redis";

export const createShortUrl = async (
  longUrl: string,
  userId: string,
  customAlias?: string,
  topic?: string
) => {
  try {
    let shortUrl = customAlias || shortid.generate();

    // Ensure unique short URL
    const existingUrl = await Url.findOne({ shortUrl });
    if (existingUrl) {
      throw new Error("Custom alias already in use.");
    }

    const newUrl = new Url({
      longUrl,
      shortUrl,
      customAlias: customAlias || null,
      topic,
      userId,
    });

    await newUrl.save();
    return newUrl;
  } catch (error) {
    throw new Error((error as any).message);
  }
};

export const getOriginalUrl = async (alias: string): Promise<string | null> => {
  // Check if URL is cached in Redis
  const cachedUrl = await redisClient.get(`shorturl:${alias}`);
  if (cachedUrl) return cachedUrl;

  // Fetch from database if not in cache
  const urlEntry = await Url.findOne({ shortUrl: alias });
  if (!urlEntry) return null;

  // Cache the URL for future requests
  await redisClient.set(`shorturl:${alias}`, urlEntry.longUrl, { EX: 3600 }); // Cache for 1 hour

  return urlEntry.longUrl;
};

export const getUrlAnalytics = async (alias: string) => {
  const totalClicks = await AnalyticsModel.countDocuments({ shortUrl: alias });
  const uniqueUsers = await AnalyticsModel.distinct("ipAddress", {
    shortUrl: alias,
  });

  const past7Days = new Date();
  past7Days.setDate(past7Days.getDate() - 7);

  const clicksByDate = await AnalyticsModel.aggregate([
    { $match: { shortUrl: alias, timestamp: { $gte: past7Days } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const osType = await AnalyticsModel.aggregate([
    { $match: { shortUrl: alias } },
    {
      $group: {
        _id: "$os",
        uniqueClicks: { $sum: 1 },
        uniqueUsers: { $addToSet: "$ipAddress" },
      },
    },
    {
      $project: {
        osName: "$_id",
        uniqueClicks: 1,
        uniqueUsers: { $size: "$uniqueUsers" },
      },
    },
  ]);

  const deviceType = await AnalyticsModel.aggregate([
    { $match: { shortUrl: alias } },
    {
      $group: {
        _id: "$device",
        uniqueClicks: { $sum: 1 },
        uniqueUsers: { $addToSet: "$ipAddress" },
      },
    },
    {
      $project: {
        deviceName: "$_id",
        uniqueClicks: 1,
        uniqueUsers: { $size: "$uniqueUsers" },
      },
    },
  ]);

  return {
    totalClicks,
    uniqueUsers: uniqueUsers.length,
    clicksByDate,
    osType,
    deviceType,
  };
};
