const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Session = require("../models/session");

exports.signup = async (req, res) => {
  console.log("✅ Signup route HIT with data:", req.body);
  try {
    const { name, email, password, role, organization } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const userRole = role || "candidate";
    if (!["candidate", "recruiter"].includes(userRole)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    if (userRole === "recruiter" && !organization) {
      return res.status(400).json({
        message: "Organization name is required for recruiters.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      organization: userRole === "recruiter" ? organization : null,
      isVerified: true, // ✅ Directly mark user as verified
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found, SignUp First!!" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your account first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    await Session.create({ userId: user._id, token });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization || null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.logout = async (req, res) => {
  await Session.deleteOne({ userId: req.user.id });

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

exports.verifyAuth = async (req, res) => {
  if (req.user) {
    return res.status(200).json({ user: req.user });
  }
  return res.status(401).json({ message: "Unauthorized" });
};
