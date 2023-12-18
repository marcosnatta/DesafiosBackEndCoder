import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  sessionSecret: process.env.SESSION_SECRET,
  environment: process.env.PRODUCTION,
  gmail_user: process.env.GMAIL_USER,
  gmail_password: process.env.GMAIL_PASSWORD
};