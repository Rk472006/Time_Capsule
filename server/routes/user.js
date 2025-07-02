const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register or login user by UID
router.post("/register", async (req, res) => {
  const { uid, email } = req.body;
  try {
    const user = new User({ uid, email });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("MongoDB error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Find UID by email
router.post("/getUIDByEmail", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ uid: user.uid });
  } catch (err) {
    console.error("MongoDB error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
