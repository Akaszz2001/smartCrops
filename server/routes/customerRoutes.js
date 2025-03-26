const express = require("express");
const User=require('../models/usr');
const isAuthenticated = require("../midilleware/auth");
const { getAllProducts} = require("../controller/viewProductController");
const router = express.Router();

// 🟢 Dashboard Route
router.get("/dashboard", (req, res) => {
  console.log("here",req.user);
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.json({ user: req.user });
});


router.get('/profile',  async (req, res) => {
  try {
    // Assuming `req.user` contains the authenticated user's ID (via Passport.js or JWT)
    const userId = req.user._id;
      console.log("user id",userId);
      
    // Find the user by ID and exclude the password field
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/viewAllProducts',isAuthenticated,getAllProducts)
module.exports = router;
