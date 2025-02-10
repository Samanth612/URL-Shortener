import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  shortUrl: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  userAgent: { type: String, required: true },
  ipAddress: { type: String, required: true },
  os: { type: String, default: "Unknown" }, // ✅ Add OS Name
  device: { type: String, default: "Unknown" }, // ✅ Add Device Name
});

const AnalyticsModel = mongoose.model("Analytics", analyticsSchema);
export default AnalyticsModel;
