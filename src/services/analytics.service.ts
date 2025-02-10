import { UAParser } from "ua-parser-js";
import AnalyticsModel from "../models/analytics.model";

export const logAnalytics = async (
  alias: string,
  userAgent: string,
  ip: string
) => {
  const parser = new UAParser();
  parser.setUA(userAgent);

  const osName = parser.getOS().name || "Unknown";
  const deviceType = parser.getDevice().type || "Desktop";

  const analyticsEntry = new AnalyticsModel({
    shortUrl: alias,
    timestamp: new Date(),
    userAgent,
    os: osName,
    device: deviceType,
    ipAddress: ip,
  });

  await analyticsEntry.save();
};
