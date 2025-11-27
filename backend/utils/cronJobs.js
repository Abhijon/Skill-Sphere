// const cron = require("node-cron");
// const OTP = require("../models/otp"); // Import OTP model
// const Session = require("../models/session");
// const mongoose = require("mongoose");

// // Schedule a job to run every 5 minutes
// cron.schedule("*/5 * * * *", async () => {
//   try {
//     const now = new Date();
//     await OTP.deleteMany({ expiresAt: { $lt: now } });
//     console.log("✅ Expired OTPs deleted");
//   } catch (error) {
//     console.error("❌ Error deleting expired OTPs:", error.message);
//   }
// });

// // Schedule a job to run every hour
// cron.schedule("0 * * * *", async () => {
//   try {
//     const now = new Date();
//     await Session.deleteMany({ expiresAt: { $lt: now } });
//     console.log("✅ Expired sessions deleted");
//   } catch (error) {
//     console.error("❌ Error deleting expired sessions:", error.message);
//   }
// });

// console.log("⏳ Cron job to delete expired OTPs & Sessions is running...");
