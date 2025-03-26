const express = require("express");
const passport = require("passport");
const User = require("../models/usr"); // Import the User model

const router = express.Router();

// 🟢   Login Route
router.get("/auth/google", (req, res, next) => {
    const state = req.query.state; // Pass the state from the query
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state, // Include the state in the OAuth flow
    })(req, res, next);
  });
  
// 🟢 Google Callback Route
// router.get(
//     "/auth/google/callback",
//     passport.authenticate("google", { failureRedirect: "/" }),
//     async (req, res) => {
//       try {
//         const user = req.user;
  
//         // Redirect based on userType
//         if (user.userType === "farmer" && (!user.farmDetails || !user.farmDetails.farmName)) {
//             return res.redirect(`http://localhost:5173/complete-farmer-details?userId=${user._id}`);
//           }
          
  
//         res.redirect("http://localhost:5173/home");
//       } catch (err) {
//         console.error("Error in Google callback:", err);
//         res.status(500).json({ error: "Internal server error" });
//       }
//     }
//   );
//   router.get("/complete-farmer-details", (req, res) => {
//     const { userId } = req.query;
  
//     if (!userId) {
//       return res.status(400).json({ error: "Missing userId" });
//     }
  
//     // Optionally render a page or send some JSON
//     res.status(200).json({
//       message: "Complete farmer details",
//       userId,
//     });
//   });
  
  
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      const user = req.user;

      // Parse the state parameter to extract userType
      const state = JSON.parse(req.query.state);
      const selectedUserType = state.userType;

      if (!selectedUserType) {
        return res.redirect("http://localhost:5173/?message=Invalid user type");
      }

      // Check if the selected userType matches the one in the database
      if (user.userType !== selectedUserType) {
        // Logout the user if the userType doesn't match
        req.logout((err) => {
          if (err) console.error("Error logging out:", err);
        });

        return res.redirect(
          `http://localhost:5173/?message=Account is not Exist.`
        );
      }

      // Redirect based on userType with a success message
      if (user.userType === "farmer" && (!user.farmDetails || !user.farmDetails.farmName)) {
        return res.redirect(
          `http://localhost:5173/complete-farmer-details?userId=${user._id}&message=Login successful...`
        );
      }

      res.redirect("http://localhost:5173/home?message=Login successful");
    } catch (err) {
      console.error("Error in Google callback:", err);
      res.redirect("http://localhost:5173/?message=Internal server error");
    }
  }
);



// 🟢 Endpoint to Complete Farmer Details
router.post("/complete-farmer-details", async (req, res) => {
  try {
    const { userId, farmName, state,district, crops } = req.body; // Retrieve details from request body

    // Update the farmer's details
    const farmer = await User.findByIdAndUpdate(
      userId,
      {
        farmDetails: { farmName,state,district, crops },
        userType: "farmer", // Ensure the userType is set to "farmer"
      },
      { new: true } // Return the updated document
    );

    res.status(200).json({ message: "Farmer details updated successfully", farmer });
  } catch (err) {
    console.error("Error updating farmer details:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 🟢 Logout Route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });

    req.session.destroy(() => {
      res.status(200).json({ success: true, redirect: "http://localhost:5173/" });
    });
  });
});

module.exports = router;
