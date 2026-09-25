const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

require("dotenv").config();

const mongoose = require("mongoose");

console.log("======================================");
console.log("MongoDB Atlas Detailed Test");
console.log("======================================");

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 10000
  })
  .then(async () => {
    console.log("✅ MONGODB ATLAS CONNECTED");

    const admin = mongoose.connection.db.admin();

    try {
      const result = await admin.ping();
      console.log("MongoDB Ping:", result);
    } catch (e) {
      console.log("Ping error:", e.message);
    }

    await mongoose.disconnect();
    process.exit(0);
  })
  .catch((err) => {
    console.log("❌ MONGODB CONNECTION FAILED");
    console.log("--------------------------------------");
    console.log("Name:", err.name);
    console.log("Message:", err.message);
    console.log("--------------------------------------");

    if (err.reason) {
      console.log("Connection reason:");
      console.log(err.reason);
    }

    if (err.cause) {
      console.log("Cause:");
      console.log(err.cause);
    }

    process.exit(1);
  });