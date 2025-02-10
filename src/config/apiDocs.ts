export const apiDocs = {
  title: "URL Shortener API",
  version: "1.0.0",
  description: "API documentation for the URL Shortener service",
  endpoints: [
    {
      method: "POST",
      path: "/api/auth/google/callback",
      description: "Initiates Google OAuth authentication.",
      requestBody: {},
      response: {
        success: true,
        message: "Redirects to Google OAuth.",
      },
    },
    {
      method: "POST",
      path: "/api/shorten",
      description: "Creates a short URL from a given long URL.",
      requestBody: {
        longUrl: "https://example.com",
        customAlias: "mycustomalias", // Optional
        topic: "marketing", // Optional
      },
      response: {
        success: true,
        shortUrl: "https://short.ly/abc123",
        createdAt: "2025-02-09T12:00:00Z",
      },
    },
    {
      method: "GET",
      path: "/api/shorten/:alias",
      description: "Redirects to the original URL based on the short alias.",
      response: {
        success: true,
        originalUrl: "https://example.com",
      },
    },
    {
      method: "GET",
      path: "/api/analytics/:alias",
      description: "Retrieves analytics for a specific short URL.",
      response: {
        success: true,
        totalClicks: 100,
        uniqueUsers: 80,
        clicksByDate: [
          { date: "2025-02-02", clicks: 20 },
          { date: "2025-02-03", clicks: 30 },
        ],
        osType: [
          { osName: "Windows", uniqueClicks: 50, uniqueUsers: 40 },
          { osName: "macOS", uniqueClicks: 30, uniqueUsers: 25 },
        ],
        deviceType: [
          { deviceName: "mobile", uniqueClicks: 60, uniqueUsers: 50 },
          { deviceName: "desktop", uniqueClicks: 40, uniqueUsers: 30 },
        ],
      },
    },
    {
      method: "GET",
      path: "/api/analytics/topic/:topic",
      description:
        "Retrieves analytics for all short URLs under a specific topic.",
      response: {
        success: true,
        totalClicks: 500,
        uniqueUsers: 400,
        clicksByDate: [
          { date: "2025-02-02", clicks: 120 },
          { date: "2025-02-03", clicks: 150 },
        ],
        urls: [
          {
            shortUrl: "https://short.ly/abc123",
            totalClicks: 200,
            uniqueUsers: 160,
          },
          {
            shortUrl: "https://short.ly/xyz789",
            totalClicks: 300,
            uniqueUsers: 240,
          },
        ],
      },
    },
    {
      method: "GET",
      path: "/api/analytics/overall",
      description:
        "Retrieves overall analytics for all URLs created by the authenticated user.",
      response: {
        success: true,
        totalUrls: 10,
        totalClicks: 1500,
        uniqueUsers: 1200,
        clicksByDate: [
          { date: "2025-02-02", clicks: 300 },
          { date: "2025-02-03", clicks: 400 },
        ],
        osType: [
          { osName: "Windows", uniqueClicks: 700, uniqueUsers: 600 },
          { osName: "macOS", uniqueClicks: 500, uniqueUsers: 400 },
        ],
        deviceType: [
          { deviceName: "mobile", uniqueClicks: 800, uniqueUsers: 700 },
          { deviceName: "desktop", uniqueClicks: 700, uniqueUsers: 500 },
        ],
      },
    },
  ],
};
