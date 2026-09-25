require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "uccis_secret",
  MONGO_URI:
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/uccis"
};