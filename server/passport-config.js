const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/usr');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google Profile:", profile); // Log the profile data

        // Extract userType from state
        const state = JSON.parse(req.query.state || "{}");
        const userType = state.userType || "customer";

        // Find or create the user
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            displayName: profile.displayName || profile.name?.givenName || "Unnamed User", // Fallback for displayName
            userType,
          });
          await user.save();
        }

        done(null, user);
      } catch (err) {
        console.error("Error during Google authentication:", err);
        done(err, null);
      }
    }
  )
);


// ✅ Serialize and Deserialize user
// Serialize user into session
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user); // Debug serialization
  done(null, user.id); // Use unique identifier like `user.id`
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    console.log("Deserializing user with ID:", id); // Debug deserialization
    const user = await User.findById(id); // Fetch the user from DB
    console.log("Deserialized user:", user); // Debug user object
    done(null, user);
  } catch (err) {
    console.error("Error deserializing user:", err);
    done(err, null);
  }
});

module.exports = passport;
