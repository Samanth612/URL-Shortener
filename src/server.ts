import dotenv from "dotenv";
import { connectDB } from "./config/db";
import app from "./app";

dotenv.config();

// Connect Database
connectDB();

app.get("/", (req, res) => {
  res.status(200).send("URL Shortener API is running.");
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
