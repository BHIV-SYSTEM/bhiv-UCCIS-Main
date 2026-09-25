const router = require("express").Router();
const fs = require("fs");

const FILE = "./data/state_history.json";

router.get("/", (req, res) => {
  try {
    if (!fs.existsSync(FILE)) {
      return res.json([]);
    }

    const raw = fs.readFileSync(FILE, "utf-8");

    // 🔥 SAFE PARSE (IMPORTANT FIX)
    const data = raw ? JSON.parse(raw) : [];

    res.json(data);
  } catch (err) {
    console.log("Memory parse error:", err);

    // fallback instead of crash
    res.json([]);
  }
});

module.exports = router;