const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const { authenticate } = require("../middleware/authenticate");

const {
  signup,
  login,
  logout,
  verifyAuth
} = require("../controllers/authController");

// ✅ User Signup (direct signup, no OTP)
router.post("/signup", wrapAsync(signup));

// ✅ User Login
router.post("/login", wrapAsync(login));

// ✅ User Logout
router.post("/logout", authenticate, wrapAsync(logout));

// ✅ Protected Route Example
router.get("/profile", authenticate, (req, res) => {
  res.status(200).json({ message: "Welcome!", user: req.user });
});
router.get("/verify", authenticate, wrapAsync(verifyAuth));

module.exports = router;
