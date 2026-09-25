require("dotenv").config();

module.exports = {
  // ==========================================
  // SERVER
  // ==========================================
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV,

  // ==========================================
  // MONGODB (Task 35 / Task 36)
  // ==========================================
  MONGO_URI: process.env.MONGO_URI,

  // ==========================================
  // JWT (Task 36)
  // ==========================================
  JWT_SECRET: process.env.JWT_SECRET,

  // ==========================================
  // MYSQL (Task 34)
  // ==========================================
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME
};