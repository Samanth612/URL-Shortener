import express from "express";
import passport from "passport";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import urlRoutes from "./routes/url.routes";
import analyticsRoutes from "./routes/analytics.routes";
import docsRoutes from "./routes/docs.routes";

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/shorten", urlRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/docs", docsRoutes);

export default app;
