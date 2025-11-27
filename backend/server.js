if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const connectDB = require("./config/db");
connectDB();
require("./utils/cronJobs"); // ✅ Make sure this doesn't include OTP stuff

const express = require("express");

const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const port = process.env.PORT || 9001;

const ExpressError = require("./utils/ExpressError");

const authRoute = require("./routes/authRoute");
const jobRoute = require("./routes/jobRoute");


app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRoute);
app.use("/api/jobs", jobRoute);


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!!"));
});

// ✅ Error Middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Something Went Wrong!!" } = err;
  res.status(status).json({ error: message });
});


app.listen(port, () => {
  console.log(`App Listening To Port ${port}`);
});
