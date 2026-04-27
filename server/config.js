require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || "http://127.0.0.1:5173",
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/carbonx",
  jwtSecret: process.env.JWT_SECRET || "carbonx-local-demo-secret"
};
