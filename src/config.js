import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  sessionSecret: process.env.SESSION_SECRET,
  environment: process.env.PRODUCTION,
};