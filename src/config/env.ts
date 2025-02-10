import dotenv from "dotenv";

dotenv.config();

export default {
  googleClientId: process.env.GOOGLE_CLIENT_ID!,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL!,
  jwtSecret: process.env.JWT_SECRET!,
};
