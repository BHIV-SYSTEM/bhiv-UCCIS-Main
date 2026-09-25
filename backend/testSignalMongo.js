require("dotenv").config();

const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

const mongoose = require("mongoose");

const SignalMongo = require("./models/SignalMongo");

async function testSignalMongo() {
  try {
    console.log("======================================");
    console.log("Connecting to MongoDB Atlas...");
    console.log("======================================");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000
    });

    console.log("✅ MongoDB Connected");
    console.log(
      "Database:",
      mongoose.connection.name
    );

    const signal = await SignalMongo.create({
      signal_id: "SIG-TEST-001",
      type: "TEST_SIGNAL",
      source_id: 101,
      confidence: 0.95,
      timestamp: new Date(),
      location_id: "zone_1",
      trace_id: "TRACE-TEST-001",
      status: "ACTIVE"
    });

    console.log("======================================");
    console.log("✅ Signal inserted into MongoDB");
    console.log("======================================");

    console.log(signal);

    await mongoose.disconnect();

    console.log("======================================");
    console.log("✅ MongoDB disconnected");
    console.log("======================================");

  } catch (error) {
    console.error("======================================");
    console.error("❌ MongoDB Test Failed");
    console.error(error.message);
    console.error("======================================");

    process.exit(1);
  }
}

testSignalMongo();