# URL Shortener & Analytics API 🚀

A URL shortener service with detailed analytics tracking, Google Sign-In authentication, rate limiting, and Redis caching for optimized performance.

## 🌟 Features

- 🔑 **Google Sign-In** authentication (No password-based login).
- 🔗 **Short URL generation** with optional **custom alias** and **topic-based categorization**.
- ⏳ **Rate Limiting** to prevent spam link generation.
- 📊 **Detailed analytics** for short URLs (total clicks, unique users, OS, device type).
- 🎯 **Topic-based analytics** for analyzing grouped short URLs.
- 📈 **Overall analytics** to track all links created by a user.
- ⚡ **Redis caching** for faster redirects and analytics retrieval.

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** Google OAuth2
- **Caching:** Redis
- **Deployment:** AWS Elastic Beanstalk

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env` file in the root directory and add:

```
MONGO_URI=<your-mongodb-atlas-uri>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
JWT_SECRET=<your-secret-key>
REDIS_URL=<your-redis-url>
BASE_URL=<your-deployment-url>
```

### 4️⃣ Run the Server

```sh
npm start
```

or using Docker:

```sh
docker-compose up
```

---

## 📌 API Endpoints

### **1️⃣ Create Short URL**

**Endpoint:** `/api/shorten`  
**Method:** `POST`  
**Request Body:**

```json
{
  "longUrl": "https://example.com",
  "customAlias": "my-link",
  "topic": "marketing"
}
```

**Response:**

```json
{
  "shortUrl": "https://your-domain.com/my-link",
  "createdAt": "2025-02-10T12:00:00Z"
}
```

### **2️⃣ Redirect Short URL**

**Endpoint:** `/api/shorten/{alias}`  
**Method:** `GET`  
🔗 Redirects to the original long URL while tracking analytics.

### **3️⃣ Get URL Analytics**

**Endpoint:** `/api/analytics/{alias}`  
**Method:** `GET`  
**Response:**

```json
{
  "totalClicks": 123,
  "uniqueUsers": 45,
  "clicksByDate": [
    { "date": "2025-02-04", "clicks": 10 },
    { "date": "2025-02-05", "clicks": 15 }
  ],
  "osType": [
    { "osName": "Windows", "uniqueClicks": 40, "uniqueUsers": 20 },
    { "osName": "iOS", "uniqueClicks": 35, "uniqueUsers": 15 }
  ],
  "deviceType": [
    { "deviceName": "mobile", "uniqueClicks": 70, "uniqueUsers": 30 },
    { "deviceName": "desktop", "uniqueClicks": 53, "uniqueUsers": 15 }
  ]
}
```

### **4️⃣ Get Topic-Based Analytics**

**Endpoint:** `/api/analytics/topic/{topic}`  
**Method:** `GET`  
**Response:**

```json
{
  "totalClicks": 500,
  "uniqueUsers": 120,
  "clicksByDate": [
    { "date": "2025-02-04", "clicks": 50 },
    { "date": "2025-02-05", "clicks": 60 }
  ],
  "urls": [
    {
      "shortUrl": "https://your-domain.com/link1",
      "totalClicks": 200,
      "uniqueUsers": 70
    },
    {
      "shortUrl": "https://your-domain.com/link2",
      "totalClicks": 300,
      "uniqueUsers": 90
    }
  ]
}
```

### **5️⃣ Get Overall Analytics**

**Endpoint:** `/api/analytics/overall`  
**Method:** `GET`  
**Response:**

```json
{
  "totalUrls": 50,
  "totalClicks": 10000,
  "uniqueUsers": 2000,
  "clicksByDate": [
    { "date": "2025-02-04", "clicks": 500 },
    { "date": "2025-02-05", "clicks": 600 }
  ],
  "osType": [
    { "osName": "Windows", "uniqueClicks": 3000, "uniqueUsers": 1200 },
    { "osName": "iOS", "uniqueClicks": 2000, "uniqueUsers": 600 }
  ],
  "deviceType": [
    { "deviceName": "mobile", "uniqueClicks": 6000, "uniqueUsers": 1400 },
    { "deviceName": "desktop", "uniqueClicks": 4000, "uniqueUsers": 600 }
  ]
}
```

---

## 🌍 Deployment

The project is live at:  
🔗 **[Live API URL](http://url-shortener-env.eba-peqry2xd.ap-south-1.elasticbeanstalk.com/api/auth/google/callback)**

---

## ⚡ Challenges & Solutions

### 🛠 **1. Efficient Caching with Redis**

**Challenge:** Database load was high due to frequent URL lookups.  
✅ **Solution:** Implemented Redis to cache short and long URLs, reducing database queries.

### 🚀 **2. Rate Limiting for API Requests**

**Challenge:** Preventing spam users from overloading the API.  
✅ **Solution:** Used **express-rate-limit** to restrict URL shortening per user.

### 📊 **3. Analytics Data Collection**

**Challenge:** Storing user interactions efficiently without violating privacy.  
✅ **Solution:** Used **GeoIP and User-Agent parsing** to collect analytics while respecting data privacy laws.
