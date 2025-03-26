const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const User=require('./models/usr')
require("dotenv").config();
require("./passport-config");
const db = require("./database/db");

// Import routers
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const farmerRoutes=require('./routes/farmerRoutes');
const cartRoutes=require('./routes/cartRoutes')
const paymentRoutes=require('./routes/paymentRoutes')
const PORT = process.env.PORT || 5000;

// 🟢 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🟢 CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 🟢 Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || "default-secret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }, // 1-day session
}));

app.use(passport.initialize());
app.use(passport.session());



app.use((req, res, next) => {
  console.log("Session data:", req.session); // Debug session
  console.log("User data:", req.user); // Debug user
  next();
});




app.use(authRoutes);
app.use("/api/user",customerRoutes);
app.use('/api/farmers',farmerRoutes)
app.use('/api/customer/cart',cartRoutes)
app.use("/api/payment", paymentRoutes);

// 🟢 Start Server
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
  db();
});
